

from smolagents import Tool
import asyncio
import time
from typing import List, Dict, Union
import json


class ParallelSearchTool(Tool):
    """
    Enhanced tool for parallel DuckDuckGo search + scraping.
    Supports concurrent multi-query execution and async-safe scraping.
    """

    name = "parallel_search_tool"
    description = (
        "Performs DuckDuckGo searches and scrapes results in parallel. "
        "Supports single or multiple queries concurrently."
    )
    inputs = {
        "query": {
            "type": "string",
            "description": "Single query or array of queries for comprehensive color analysis."
        }
    }
    output_type = "object"

    def __init__(self, max_results_per_query=2, scrape_timeout=40, max_results=None, max_concurrent_queries=5):
        super().__init__()

        self.max_results_per_query = max_results if max_results is not None else max_results_per_query
        self.scrape_timeout = scrape_timeout
        self.query_semaphore = asyncio.Semaphore(max_concurrent_queries)

        # Lazy import to avoid circular dependencies
        from app.ai.color_agents import WebSearchAgent
        from app.ai.web_scrapper_agent import WebScraperAgent

        self.search_agent = WebSearchAgent(max_results=self.max_results_per_query)
        self.scraper_agent = WebScraperAgent(concurrency_limit=15)

    async def _async_search(self, query: str):
        """
        Run the blocking DDGS search call in a thread executor to avoid blocking event loop.
        """
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, lambda: self.search_agent.search(query))

    async def process_single_query(self, query: str) -> Dict:
        """
        Handles a single query: performs search and scraping in sequence (async-safe).
        """
        async with self.query_semaphore:
            try:
                print(f"🔍 Searching: {query}")
                urls = await self._async_search(query)
                urls = urls[:self.max_results_per_query]

                if not urls:
                    print(f"❌ No results for: {query}")
                    return {
                        "query": query,
                        "status": "no_results",
                        "urls": [],
                        "scraped_texts": {},
                        "combined": ""
                    }

                print(f"📄 Scraping {len(urls)} pages for: {query}")
                scraped_texts = await self.scraper_agent.scrape_multiple(
                    urls, timeout_per_url=8, global_timeout=15
                )

                # Truncate long texts for stability
                combined = "\n\n".join(
                    f"--- {url} ---\n{text[:8000]}"
                    for url, text in scraped_texts.items()
                    if len(text) > 200
                )

                status = "success" if combined else "scraping_failed"
                print(f"✅ {query}: {status} ({len(scraped_texts)}/{len(urls)} pages)")

                return {
                    "query": query,
                    "status": status,
                    "urls": urls,
                    "scraped_texts": scraped_texts,
                    "combined": combined,
                    "sources_count": len(scraped_texts)
                }

            except Exception as e:
                print(f"❌ Error processing '{query}': {e}")
                return {
                    "query": query,
                    "status": "error",
                    "urls": [],
                    "scraped_texts": {},
                    "combined": "",
                    "error": str(e)
                }

    async def forward(self, query: Union[str, List[str]]) -> str:
        """
        Main entry point for smolagents — runs one or more queries concurrently.
        Returns JSON-formatted output for agent pipelines.
        """
        start_time = time.time()

        # Normalize input
        if isinstance(query, str):
            queries = [query]
            single_query_mode = True
        elif isinstance(query, list):
            queries = query
            single_query_mode = False
        else:
            return json.dumps({"status": "error", "message": "Query must be string or list."})

        if not queries:
            return json.dumps({"status": "error", "message": "No queries provided."})

        print(f"🚀 Starting concurrent execution of {len(queries)} queries...")

        # Create async tasks
        tasks = [asyncio.create_task(self.process_single_query(q)) for q in queries]

        try:
            results = await asyncio.wait_for(
                asyncio.gather(*tasks, return_exceptions=True),
                timeout=self.scrape_timeout
            )
        except asyncio.TimeoutError:
            print(f"⏱️ Global timeout reached ({self.scrape_timeout}s)")
            results = []
            for t in tasks:
                if t.done() and not t.cancelled():
                    try:
                        results.append(t.result())
                    except Exception as e:
                        results.append({"query": "unknown", "status": "error", "error": str(e)})
                else:
                    results.append({"query": "unknown", "status": "timeout"})

        # Combine results
        all_combined = []
        total_sources = 0
        successful_queries = []
        failed_queries = []

        for result in results:
            if not isinstance(result, dict):
                failed_queries.append({"query": "unknown", "status": "error", "error": str(result)})
                continue

            q = result.get("query", "unknown")
            status = result.get("status", "unknown")

            if status == "success" and result.get("combined"):
                successful_queries.append(q)
                total_sources += result.get("sources_count", 0)
                all_combined.append(f"## 🔍 {q}\n{result['combined']}")
            else:
                failed_queries.append({
                    "query": q,
                    "status": status,
                    "error": result.get("error", "")
                })

        elapsed = round(time.time() - start_time, 2)
        print(f"\n📊 Parallel Search Summary:")
        print(f"   ✅ Success: {len(successful_queries)}/{len(queries)}")
        print(f"   ❌ Failed: {len(failed_queries)}")
        print(f"   📚 Total Sources: {total_sources}")
        print(f"   ⏱️ Elapsed: {elapsed}s")

        combined_text = "\n\n".join(all_combined)

        # === Single query response ===
        if single_query_mode:
            first_result = (
                results[0]
                if results and isinstance(results[0], dict)
                else {"urls": [], "scraped_texts": {}, "combined": ""}
            )
            return json.dumps({
                "status": "success" if combined_text else "error",
                "urls": first_result.get("urls", []),
                "scraped_texts": first_result.get("scraped_texts", {}),
                "combined": combined_text,
                "elapsed_sec": elapsed
            })

        # === Multi-query response ===
        return json.dumps({
            "status": "success" if combined_text else "partial_success",
            "combined_content": combined_text,
            "successful_queries": successful_queries,
            "failed_queries": failed_queries,
            "total_sources": total_sources,
            "elapsed_sec": elapsed
        })

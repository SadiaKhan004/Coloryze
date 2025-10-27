
from fastapi import APIRouter, Request, HTTPException
import asyncio
from app.ai.color_query_builder import build_color_queries
from app.ai.color_agents import WebSearchAgent
from app.ai.web_scrapper_agent import WebScraperAgent
from app.ai.report_generator_agent import FinalAnswerTool  # ✅ NEW

router = APIRouter()

# # Initialize agents once globally — not on every reload
# search_agent = WebSearchAgent(max_results=3)
# scraper_agent = WebScraperAgent(max_output_chars=15000, concurrency_limit=5)
search_agent = WebSearchAgent(max_results=2)  # ↓ from 3
scraper_agent = WebScraperAgent(max_output_chars=8000, concurrency_limit=10)

final_tool = FinalAnswerTool()  # ✅ Use final summarizer

@router.post("/generate-report/")
async def generate_final_report(request: Request):
    """
    Run the complete pipeline:
    1. Build color queries
    2. Perform web search
    3. Scrape all pages concurrently
    4. Combine all text into one corpus
    5. Generate a final structured report using FinalAnswerTool
    """
    try:
        data = await request.json()
        ai_result = data.get("ai_result", {})

        # Prevent accidental re-triggering on duplicate requests
        if not ai_result:
            raise HTTPException(status_code=400, detail="Missing AI result data.")

        # Step 1: Build queries
        queries = build_color_queries(ai_result)
        if not queries:
            raise HTTPException(status_code=400, detail="No valid color queries built.")

        # Step 2: Collect all text content
        all_texts = []

        for i, q in enumerate(queries):
            print(f"🔍 Processing query {i+1}/{len(queries)}: {q}")

            # Small async pause (avoid rate limits)
            if i > 0:
                await asyncio.sleep(0.5)

            # Search for URLs
            urls = search_agent.search(q)
            if not urls:
                print(f"⚠️ No URLs found for query: {q}")
                continue

            # Scrape text concurrently from all URLs
            scraped_data = await scraper_agent.scrape_multiple(urls)

            if not scraped_data:
                print(f"⚠️ No text scraped for query: {q}")
                continue

            # Combine text for this query
            combined = " ".join(scraped_data.values())
            all_texts.append(combined)

        # Step 3: Merge all text from all queries
        if not all_texts:
            raise HTTPException(status_code=404, detail="No text scraped from web sources.")

        combined_text = " ".join(all_texts)

        # Step 4: Generate final AI-based report
        final_output = final_tool.forward(combined_text)
        final_report = final_output.get("final_report", "No report generated.")

        # ✅ Print report to console before returning
        print("\n===============================")
        print("📝 FINAL COLORYZE REPORT (PREVIEW)")
        print("===============================")
        print(final_report)
        print("===============================\n")

        # ✅ Return final JSON response
        return {
            "status": "success",
            "final_report": final_report
        }

    except Exception as e:
        print(f"❌ Error in generate_final_report: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

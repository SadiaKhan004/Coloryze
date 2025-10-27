import asyncio
import httpx
from bs4 import BeautifulSoup

class WebScraperAgent:
    """
    Async scraper that fetches multiple pages concurrently.
    Returns clean text (no scripts, images, or videos) for LLM input.
    """
    def __init__(self, max_output_chars=15000, concurrency_limit=5):
        self.max_output_chars = max_output_chars
        self.semaphore = asyncio.Semaphore(concurrency_limit)
        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/141.0.0.0 Safari/537.36"
            )
        }

    async def _fetch(self, client: httpx.AsyncClient, url: str):
        async with self.semaphore:  # limit simultaneous connections
            try:
                resp = await client.get(url, headers=self.headers, timeout=15)
                resp.raise_for_status()
                soup = BeautifulSoup(resp.text, "html.parser")

                for tag in soup(["script", "style", "img", "video", "noscript", "iframe", "svg"]):
                    tag.decompose()

                text = " ".join(soup.stripped_strings)
                if len(text) > self.max_output_chars:
                    text = text[:self.max_output_chars]

                print(f"\n=== Scraped URL ===\n{url}\nPreview:\n{text[:300]}...\n")
                return url, text
            except Exception as e:
                print(f"Error scraping {url}: {e}")
                return url, None

    async def scrape_multiple(self, urls):
        async with httpx.AsyncClient(follow_redirects=True) as client:
            tasks = [self._fetch(client, url) for url in urls]
            results = await asyncio.gather(*tasks)
            return {url: text for url, text in results if text}


import asyncio
import httpx
from bs4 import BeautifulSoup
import re
import random


class WebScraperAgent:
    """
    Fast web scraper optimized for <20s total scraping time.
    """

    UNWANTED_TEXT_KEYWORDS = [
        "cookie", "gdpr", "accept all", "reject all", "cart", "checkout",
        "quantity", "subtotal", "sign up", "subscribe", "newsletter"
    ]

    USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    ]

    def __init__(self, max_output_chars=15000, concurrency_limit=10, preview_chars=500):
        self.max_output_chars = max_output_chars
        self.preview_chars = preview_chars
        self.semaphore = asyncio.Semaphore(concurrency_limit)

    def _get_headers(self):
        """Rotate user agents"""
        return {
            "User-Agent": random.choice(self.USER_AGENTS),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Connection": "keep-alive",
        }

    def _extract_clean_text(self, html: str, url: str) -> str:
        """Extract readable text from HTML - optimized version."""
        try:
            soup = BeautifulSoup(html, "lxml")  # lxml is faster than html.parser
        except:
            soup = BeautifulSoup(html, "html.parser")

        # Remove unwanted tags
        for tag in soup(["script", "style", "img", "video", "noscript", 
                         "iframe", "svg", "header", "footer", "nav", 
                         "form", "button", "aside", "ad"]):
            tag.decompose()

        # Strategy 1: Find main/article section
        main_content = (
            soup.find("main")
            or soup.find("article")
            or soup.find(class_=re.compile(r"(content|article|post|entry|body)", re.I))
            or soup.find(id=re.compile(r"(content|article|main|post|body)", re.I))
            or soup.find("div", class_=re.compile(r"container|wrapper", re.I))
        )

        # Strategy 2: fallback to all paragraphs
        if not main_content or len(main_content.get_text(strip=True)) < 200:
            paragraphs = soup.find_all("p")
            # Get substantial paragraphs
            big_p = [p.get_text(strip=True) for p in paragraphs if len(p.get_text(strip=True)) > 40]
            text = "\n".join(big_p[:25])  # Increased from 20
        else:
            text = main_content.get_text(separator="\n", strip=True)

        # Filter unwanted text
        lines = text.splitlines()
        filtered = []
        for line in lines:
            line_clean = line.strip()
            if (len(line_clean) > 15 and 
                not any(kw in line_clean.lower() for kw in self.UNWANTED_TEXT_KEYWORDS)):
                filtered.append(line_clean)
        
        clean_text = "\n".join(filtered)
        clean_text = re.sub(r'\n{3,}', '\n\n', clean_text).strip()

        return clean_text[:self.max_output_chars]

    async def _fetch(self, client: httpx.AsyncClient, url: str, timeout: float = 8):
        """
        Fast fetch with timeout - NO Selenium fallback.
        """
        async with self.semaphore:
            try:
                resp = await client.get(
                    url, 
                    headers=self._get_headers(), 
                    timeout=timeout,
                    follow_redirects=True
                )
                resp.raise_for_status()

                text = self._extract_clean_text(resp.text, url)
                
                # If content is too short, it's still better than nothing
                if len(text) < 100:
                    print(f"⚠️ {url}: Short content ({len(text)} chars)")
                    return url, text if text else None
                
                print(f"✅ {url} - {len(text)} chars")
                return url, text

            except asyncio.TimeoutError:
                print(f"⏱️ Timeout: {url}")
                return url, None
            except Exception as e:
                print(f"❌ Failed: {url} - {str(e)[:100]}")
                return url, None

    async def scrape_multiple(self, urls, timeout_per_url=8, global_timeout=35):
        """
        Scrape multiple URLs with aggressive timeouts.
        
        Args:
            urls: List of URLs to scrape
            timeout_per_url: Max time per individual request (default 8s)
            global_timeout: Max total time for all scraping (default 15s)
        """
        if not urls:
            return {}

        try:
            async with httpx.AsyncClient(
                limits=httpx.Limits(max_connections=20, max_keepalive_connections=10),
                timeout=httpx.Timeout(timeout_per_url, connect=5.0)
            ) as client:
                tasks = [
                    asyncio.create_task(self._fetch(client, url, timeout_per_url)) 
                    for url in urls
                ]
                
                # Apply global timeout
                results = await asyncio.wait_for(
                    asyncio.gather(*tasks, return_exceptions=True),
                    timeout=global_timeout
                )
                
                # Filter out exceptions and None results
                scraped_data = {}
                for result in results:
                    if isinstance(result, tuple) and result[1]:
                        url, text = result
                        scraped_data[url] = text
                
                return scraped_data

        except asyncio.TimeoutError:
            print(f"⏱️ Global timeout reached ({global_timeout}s)")
            # Return whatever we got so far
            scraped_data = {}
            for task in tasks:
                if task.done() and not task.exception():
                    result = task.result()
                    if result and result[1]:
                        scraped_data[result[0]] = result[1]
            return scraped_data
        except Exception as e:
            print(f"❌ Scraping error: {e}")
            return {}

    def scrape_url_sync(self, url: str, timeout=8):
        """Sync wrapper for scraping a single URL."""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            result = loop.run_until_complete(
                asyncio.wait_for(
                    self.scrape_multiple([url], timeout_per_url=timeout),
                    timeout=timeout + 2
                )
            )
            return result.get(url)
        finally:
            loop.close()
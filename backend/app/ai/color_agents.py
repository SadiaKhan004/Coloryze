
from ddgs import DDGS

class WebSearchAgent:
    def __init__(self, max_results=5):
        self.max_results = max_results
        self.allowlist = [
            "colorwise.me", "aicoloranalysis.com", "theconceptwardrobe.com",
            "colormebeautiful.com", "radiantlydressed.com", "byrdie.com",
            "womansday.com", "freebunni.com", "tsingapore.com", "makeup.com"
        ]

        # Simple relevance keywords to keep focus
        self.relevance_keywords = [
            "color", "palette", "undertone", "skin tone", "makeup", "wardrobe",
            "fashion", "style", "seasonal", "beauty", "hair color"
        ]

    def search(self, query: str):
        try:
            with DDGS() as ddgs:
                results = ddgs.text(query, max_results=self.max_results * 4)
                urls = []
                for r in results:
                    url = r.get("href", "")
                    title = (r.get("title") or "").lower()
                    body = (r.get("body") or "").lower()

                    # Allowlist priority
                    if any(domain in url for domain in self.allowlist):
                        urls.append(url)
                        continue

                    #  Otherwise, check keyword relevance
                    if any(k in title or k in body for k in self.relevance_keywords):
                        urls.append(url)

                #  Deduplicate and trim
                urls = list(dict.fromkeys(urls))
                return urls[:self.max_results]

        except Exception as e:
            print(f" Search error: {e}")
            return []

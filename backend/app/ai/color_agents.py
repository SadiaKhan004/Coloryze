

from ddgs import DDGS

class WebSearchAgent:
    def __init__(self, max_results=2):
        self.max_results = max_results
        
        # Tier 1: Premium fashion/beauty authorities
        self.tier1_domains = [
            "vogue.com", "allure.com", "harpersbazaar.com", "elle.com",
            "marieclaire.com", "instyle.com", "glamour.com", "cosmopolitan.com",
            "byrdie.com", "whowhatwear.com", "refinery29.com","ajeworld.com","thelaurieloo.com"
        ]
        
        # Tier 2: Specialized color analysis sites
        self.tier2_domains = [
            "colorwise.me", "aicoloranalysis.com", "theconceptwardrobe.com",
            "colormebeautiful.com", "radiantlydressed.com", "styleyourself.com",
            "30somethingurbangirl.com", "gabriellearruda.com", "prettyyourworld.com",
            "trueyou-colouranalysis.com", "kettlewellcolours.co.uk"
        ]
        
        # Tier 3: Reliable beauty/lifestyle sites
        self.tier3_domains = [
            "makeup.com", "ipsy.com", "sephora.com", "ulta.com",
            "womansday.com", "goodhousekeeping.com", "realsimple.com",
            "hellomagazine.com", "popsugar.com", "purewow.com",
            "thetrendspotter.net", "styledumonde.com"
        ]
        
        # Tier 4: Health/dermatology (for skin tone info)
        self.tier4_domains = [
            "healthline.com", "webmd.com", "medicalnewstoday.com",
            "mayoclinic.org", "aad.org"  # American Academy of Dermatology
        ]
        
        # Combine all tiers
        self.allowlist = (
            self.tier1_domains + self.tier2_domains + 
            self.tier3_domains + self.tier4_domains
        )
        
        # Expanded blocklist
        self.blocklist = [
            # Dictionaries/Generic info
            "merriam-webster.com", "dictionary.cambridge.org", "wikipedia.org",
            "dictionary.com", "thesaurus.com",
            
            # Low-quality blogs
            "blogstoread.com", "happylifestylejournal.com", 
            "blog.fashionwithaconscience.org", "medium.com",
            
            # Social media (unreliable)
            "pinterest.com", "instagram.com", "facebook.com", 
            "twitter.com", "reddit.com", "quora.com",
            
            # Shopping/affiliate sites
            "amazon.com", "ebay.com", "aliexpress.com",
            
            # Generic content farms
            "wikihow.com", "answers.com", "buzzfeed.com"
        ]

        # Enhanced relevance keywords
        self.relevance_keywords = [
            # Color theory
            "color palette", "color analysis", "seasonal color", "color theory",
            "color wheel", "complementary colors", "color harmony",
            
            # Skin/undertones
            "skin tone", "undertone", "warm undertone", "cool undertone",
            "neutral undertone", "olive skin", "fair skin", "deep skin",
            
            # Fashion/style
            "wardrobe colors", "clothing colors", "fashion colors", 
            "style guide", "color coordination", "outfit colors",
            
            # Makeup/beauty
            "makeup colors", "eyeshadow", "lipstick colors", "foundation",
            "blush colors", "beauty palette", "flattering colors",
            
            # Accessories
            "jewelry metals", "gold vs silver", "rose gold", "accessories",
            
            # Hair
            "hair color", "blonde", "brunette", "red hair", "black hair",
            
            # Seasonal
            "spring palette", "summer palette", "autumn palette", "winter palette",
            "warm spring", "cool summer", "deep autumn", "bright winter"
        ]

    def get_domain_priority(self, url):
        """Assign priority score to URL based on domain tier"""
        url_lower = url.lower()
        
        if any(domain in url_lower for domain in self.tier1_domains):
            return 4  # Highest priority
        elif any(domain in url_lower for domain in self.tier2_domains):
            return 3
        elif any(domain in url_lower for domain in self.tier3_domains):
            return 2
        elif any(domain in url_lower for domain in self.tier4_domains):
            return 1
        return 0  # Unknown domain

    def should_include_url(self, url, title="", body=""):
        """Check if URL should be included in results"""
        url_lower = url.lower()
        
        # Blocklist check first
        if any(blocked in url_lower for blocked in self.blocklist):
            return False
        
        # Allowlist gets automatic pass
        if any(allowed in url_lower for allowed in self.allowlist):
            return True
        
        # For non-allowlist domains, require strong keyword relevance
        text_to_check = f"{title} {body}".lower()
        keyword_matches = sum(1 for k in self.relevance_keywords if k in text_to_check)
        
        # Require at least 2 keyword matches for unknown domains
        return keyword_matches >= 2

    def calculate_relevance_score(self, result):
        """Calculate relevance score for ranking results"""
        url = result.get("href", "")
        title = (result.get("title") or "").lower()
        body = (result.get("body") or "").lower()
        
        score = 0
        
        # Domain priority (0-40 points)
        score += self.get_domain_priority(url) * 10
        
        # Keyword matching (up to 30 points)
        text = f"{title} {body}"
        keyword_matches = sum(1 for k in self.relevance_keywords if k in text)
        score += min(keyword_matches * 3, 30)
        
        # Title relevance bonus (up to 20 points)
        if any(k in title for k in ["color analysis", "skin tone", "seasonal color", "palette"]):
            score += 20
        elif any(k in title for k in self.relevance_keywords[:10]):
            score += 10
        
        # Recency bonus (up to 10 points) - check if recent year in title/body
        for year in ["2024", "2025", "2023"]:
            if year in title or year in body:
                score += 10
                break
        
        return score

    def search(self, query: str):
        try:
            with DDGS() as ddgs:
                # Fetch more results initially for better filtering
                results = list(ddgs.text(query, max_results=self.max_results * 6))
                
                # Score and filter results
                scored_results = []
                for r in results:
                    url = r.get("href", "")
                    title = r.get("title", "")
                    body = r.get("body", "")
                    
                    if self.should_include_url(url, title, body):
                        score = self.calculate_relevance_score(r)
                        scored_results.append((score, url))
                
                # Sort by score (descending) and take top results
                scored_results.sort(reverse=True, key=lambda x: x[0])
                urls = [url for _, url in scored_results]
                
                # Deduplicate while preserving order
                seen = set()
                unique_urls = []
                for url in urls:
                    if url not in seen:
                        seen.add(url)
                        unique_urls.append(url)
                
                # Return top N results
                final_urls = unique_urls[:self.max_results]
                
                # Debug logging
                print(f"🔍 Query: {query}")
                print(f"📊 Found {len(results)} initial results")
                print(f"✅ Filtered to {len(final_urls)} quality results")
                for i, url in enumerate(final_urls, 1):
                    print(f"  {i}. {url}")
                
                return final_urls

        except Exception as e:
            print(f"❌ Search error: {e}")
            return []
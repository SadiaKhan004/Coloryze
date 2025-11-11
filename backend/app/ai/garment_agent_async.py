

# import asyncio
# import re
# from io import BytesIO
# from urllib.parse import urlparse
# import os

# import aiohttp
# import numpy as np
# from ddgs import DDGS
# from PIL import Image
# from sklearn.cluster import KMeans
# from skimage.color import rgb2lab, deltaE_ciede2000
# from concurrent.futures import ThreadPoolExecutor
# from rembg import remove
# import webcolors

# # -----------------------------------
# # CONFIG
# # -----------------------------------
# KMEANS_CLUSTERS = 3
# KMEANS_N_INIT = 5
# SIMILARITY_THRESHOLD = 25.0
# MAX_RESULTS_PER_QUERY = 8
# MAX_MATCHES_PER_COLOR = 1
# CPU_POOL_WORKERS = 16  # Increased for faster CPU-bound tasks

# Image.MAX_IMAGE_PIXELS = None  # Disable decompression bomb warnings

# # -----------------------------------
# # Color utilities
# # -----------------------------------
# def get_color_synonyms_from_hex(hex_code):
#     try:
#         closest_name = webcolors.hex_to_name(hex_code, spec='css3')
#     except ValueError:
#         def closest_color(requested_color):
#             min_colors = {}
#             for name in webcolors.names("css3"):
#                 r_c, g_c, b_c = webcolors.name_to_rgb(name)
#                 rd = (r_c - requested_color[0]) ** 2
#                 gd = (g_c - requested_color[1]) ** 2
#                 bd = (b_c - requested_color[2]) ** 2
#                 min_colors[(rd + gd + bd)] = name
#             return min_colors[min(min_colors.keys())]
#         requested_rgb = webcolors.hex_to_rgb(hex_code)
#         closest_name = closest_color(requested_rgb)

#     base = closest_name.lower()
#     color_groups = {
#         "blue": ["blue","navy", "indigo", "sky", "azure", "teal"],
#         "red": ["red","maroon", "crimson", "burgundy", "scarlet", "rose"],
#         "green": ["green","olive", "mint", "emerald", "lime", "moss"],
#         "yellow": ["yellow","gold", "mustard", "ochre", "amber"],
#         "brown": ["brown","tan", "camel", "chocolate", "coffee"],
#         "black": ["black","charcoal", "jet", "ebony"],
#         "white": ["white","ivory", "cream", "off-white"],
#         "pink": ["pink","blush", "rose", "fuchsia"],
#         "orange": ["orange","coral", "peach", "rust", "terracotta"],
#         "purple": ["purple","violet", "plum", "lavender", "mauve"]
#     }

#     for key, group in color_groups.items():
#         if base == key or base in group:
#             return group
#     return [base]

# def hex_to_rgb(hex_color):
#     hex_color = hex_color.strip("#")
#     return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

# def rgb_to_lab(rgb):
#     rgb_arr = np.array(rgb, dtype=np.float32).reshape(1, 1, 3) / 255.0
#     return rgb2lab(rgb_arr)[0, 0]

# def delta_e_cie2000(lab1, lab2):
#     lab1_arr = np.array(lab1).reshape(1, 1, 3)
#     lab2_arr = np.array(lab2).reshape(1, 1, 3)
#     return float(deltaE_ciede2000(lab1_arr, lab2_arr)[0, 0])

# # -----------------------------------
# # Blocking image analysis
# # -----------------------------------
# def _process_image_bytes(img_bytes, target_hex):
#     try:
#         img_no_bg_bytes = remove(img_bytes)
#         with Image.open(BytesIO(img_no_bg_bytes)) as img_no_bg:
#             img_no_bg = img_no_bg.convert("RGB")
#             max_dim = 2000
#             if max(img_no_bg.size) > max_dim:
#                 img_no_bg.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
#             img_small = img_no_bg.resize((100, 100))
#             pixels = np.array(img_small).reshape(-1, 3)

#             kmeans = KMeans(n_clusters=KMEANS_CLUSTERS, n_init=KMEANS_N_INIT, random_state=42)
#             kmeans.fit(pixels)
#             cluster_centers = np.clip(kmeans.cluster_centers_, 0, 255)

#             target_rgb = hex_to_rgb(target_hex)
#             target_lab = rgb_to_lab(target_rgb)

#             best_diff = float("inf")
#             best_cluster = None
#             for c in cluster_centers:
#                 cluster_rgb = tuple(map(int, c))
#                 diff = delta_e_cie2000(rgb_to_lab(cluster_rgb), target_lab)
#                 if diff < best_diff:
#                     best_diff = diff
#                     best_cluster = cluster_rgb

#             return target_hex, best_cluster, float(best_diff)
#     except Exception as e:
#         print(f"⚠️ Image processing failed: {e}")
#         return None

# # -----------------------------------
# # Garment Agent
# # -----------------------------------
# class GarmentMatchAgent:
#     def __init__(self, palette_hexs, store_url, gender="female", max_matches_per_color=MAX_MATCHES_PER_COLOR):
#         self.palette_hexs = palette_hexs
#         self.gender = gender.lower()
#         self.max_matches_per_color = max_matches_per_color
#         self.cpu_pool = ThreadPoolExecutor(max_workers=CPU_POOL_WORKERS)
#         parsed = urlparse(store_url)
#         self.domain = parsed.netloc or parsed.path
#         self._ddgs = DDGS()
#         self.garments = ["dress", "shirt"] if self.gender == "female" else ["shirt", "kurta", "suit"]

#     async def _run_ddg_query(self, query, max_results=MAX_RESULTS_PER_QUERY):
#         loop = asyncio.get_event_loop()
#         def sync_query():
#             out = []
#             try:
#                 for r in self._ddgs.text(query, max_results=max_results):
#                     href = r.get("href")
#                     if href:
#                         out.append(href)
#             except Exception:
#                 pass
#             return out
#         return await loop.run_in_executor(self.cpu_pool, sync_query)

#     async def _fetch_html(self, session, url, timeout=10):
#         try:
#             async with session.get(url, timeout=timeout) as resp:
#                 if resp.status == 200:
#                     return await resp.text()
#         except Exception:
#             return None

#     async def _fetch_image_bytes(self, session, url, timeout=10):
#         try:
#             async with session.get(url, timeout=timeout) as resp:
#                 if resp.status == 200:
#                     return await resp.read()
#         except Exception:
#             return None

#     async def _analyze_image_async(self, img_bytes, target_hex):
#         loop = asyncio.get_event_loop()
#         return await loop.run_in_executor(self.cpu_pool, _process_image_bytes, img_bytes, target_hex)

#     async def _process_product_page(self, session, href, target_hex):
#         html = await self._fetch_html(session, href)
#         if not html:
#             return None
#         img_match = re.search(r'(https?://[^\s"\']+\.(?:jpg|jpeg|png))', html)
#         if not img_match:
#             return None
#         img_url = img_match.group(1)
#         img_bytes = await self._fetch_image_bytes(session, img_url)
#         if not img_bytes:
#             return None
#         res = await self._analyze_image_async(img_bytes, target_hex)
#         if not res:
#             return None
#         _, dominant_rgb, diff = res
#         if diff < SIMILARITY_THRESHOLD:
#             os.makedirs("matched_images", exist_ok=True)
#             filename = f"example_{hash(img_url) & 0xfffffff}.jpg"
#             save_path = os.path.join("matched_images", filename)
#             try:
#                 with open(save_path, "wb") as f:
#                     f.write(img_bytes)
#             except Exception as e:
#                 save_path = None
#             return {
#                 "url": href,
#                 "image_url": img_url,
#                 "saved_image_path": save_path,
#                 "color": target_hex,
#                 "dominant": dominant_rgb,
#                 "distance": diff
#             }
#         return None

#     async def _process_color(self, color_hex, session):
#         syns = get_color_synonyms_from_hex(color_hex)
#         checked_links = set()
#         tasks = []

#         # Run all queries concurrently
#         for syn in syns:
#             for garment in self.garments:
#                 gender_prefix = "women" if self.gender == "female" else "men"
#                 query = f"{gender_prefix} {syn} {garment} site:{self.domain}"
#                 tasks.append(self._run_ddg_query(query))

#         results = await asyncio.gather(*tasks)
#         hrefs_to_process = []
#         for hrefs in results:
#             for href in hrefs:
#                 href_clean = href.split("?")[0]
#                 if href_clean.endswith(".html") and href_clean not in checked_links:
#                     checked_links.add(href_clean)
#                     hrefs_to_process.append(href_clean)

#         page_tasks = [self._process_product_page(session, h, color_hex) for h in hrefs_to_process]
#         for coro in asyncio.as_completed(page_tasks):
#             res = await coro
#             if res:
#                 return [res]  # only one match per color
#         return []

#     async def run(self):
#         async with aiohttp.ClientSession() as session:
#             tasks = [self._process_color(color_hex, session) for color_hex in self.palette_hexs]
#             results = []
#             for coro in asyncio.as_completed(tasks):
#                 res = await coro
#                 if res:
#                     results.extend(res)
#             return results

#     def close(self):
#         try:
#             self._ddgs.close()
#         except Exception:
#             pass
#         self.cpu_pool.shutdown(wait=False)


# async def run_garment_match(color_hex: str, store_url: str, gender: str = "female", max_matches_per_color: int = 1):
#     agent = GarmentMatchAgent([color_hex], store_url, gender=gender, max_matches_per_color=max_matches_per_color)
#     try:
#         results = await agent.run()
#         return results
#     except asyncio.CancelledError:
#         return []
#     finally:
#         agent.close()
import asyncio
import re
from io import BytesIO
from urllib.parse import urlparse
import os

import aiohttp
import numpy as np
from ddgs import DDGS
from PIL import Image
from sklearn.cluster import KMeans
from skimage.color import rgb2lab, deltaE_ciede2000
from concurrent.futures import ThreadPoolExecutor
from rembg import remove
import webcolors

# -----------------------------------
# CONFIG - BALANCED FOR SPEED & RESULTS
# -----------------------------------
KMEANS_CLUSTERS = 3
KMEANS_N_INIT = 3
SIMILARITY_THRESHOLD = 30.0  # Slightly more lenient
MAX_RESULTS_PER_QUERY = 10  # Increased back
MAX_MATCHES_PER_COLOR = 1
CPU_POOL_WORKERS = 8
MAX_CONCURRENT_PAGES = 15  # Process more pages at once
MAX_CONCURRENT_IMAGES = 8
TIMEOUT_SECONDS = 10
USE_BACKGROUND_REMOVAL = False  # Set to True if needed

Image.MAX_IMAGE_PIXELS = None

# -----------------------------------
# Color utilities
# -----------------------------------
def get_color_synonyms_from_hex(hex_code):
    try:
        closest_name = webcolors.hex_to_name(hex_code, spec='css3')
    except ValueError:
        def closest_color(requested_color):
            min_colors = {}
            for name in webcolors.names("css3"):
                r_c, g_c, b_c = webcolors.name_to_rgb(name)
                rd = (r_c - requested_color[0]) ** 2
                gd = (g_c - requested_color[1]) ** 2
                bd = (b_c - requested_color[2]) ** 2
                min_colors[(rd + gd + bd)] = name
            return min_colors[min(min_colors.keys())]
        requested_rgb = webcolors.hex_to_rgb(hex_code)
        closest_name = closest_color(requested_rgb)

    base = closest_name.lower()
    color_groups = {
        "blue": ["blue", "navy", "indigo", "sky"],
        "red": ["red", "maroon", "crimson"],
        "green": ["green", "olive", "emerald"],
        "yellow": ["yellow", "gold", "mustard"],
        "brown": ["brown", "tan", "camel"],
        "black": ["black", "charcoal"],
        "white": ["white", "ivory", "cream"],
        "pink": ["pink", "rose", "blush"],
        "orange": ["orange", "coral", "peach"],
        "purple": ["purple", "violet", "plum"]
    }

    for key, group in color_groups.items():
        if base == key or base in group:
            return group[:3]  # Top 3 synonyms
    return [base]

def hex_to_rgb(hex_color):
    hex_color = hex_color.strip("#")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_lab(rgb):
    rgb_arr = np.array(rgb, dtype=np.float32).reshape(1, 1, 3) / 255.0
    return rgb2lab(rgb_arr)[0, 0]

def delta_e_cie2000(lab1, lab2):
    lab1_arr = np.array(lab1).reshape(1, 1, 3)
    lab2_arr = np.array(lab2).reshape(1, 1, 3)
    return float(deltaE_ciede2000(lab1_arr, lab2_arr)[0, 0])

# -----------------------------------
# Optimized image analysis
# -----------------------------------
def _process_image_bytes(img_bytes, target_hex):
    try:
        if USE_BACKGROUND_REMOVAL:
            img_no_bg_bytes = remove(img_bytes)
            img_data = BytesIO(img_no_bg_bytes)
        else:
            img_data = BytesIO(img_bytes)
        
        with Image.open(img_data) as img:
            img = img.convert("RGB")
            
            # Faster processing with smaller size
            img_small = img.copy()
            img_small.thumbnail((120, 120), Image.Resampling.LANCZOS)
            pixels = np.array(img_small).reshape(-1, 3)

            kmeans = KMeans(
                n_clusters=KMEANS_CLUSTERS, 
                n_init=KMEANS_N_INIT, 
                random_state=42, 
                max_iter=150
            )
            kmeans.fit(pixels)
            cluster_centers = np.clip(kmeans.cluster_centers_, 0, 255)

            target_rgb = hex_to_rgb(target_hex)
            target_lab = rgb_to_lab(target_rgb)

            best_diff = float("inf")
            best_cluster = None
            for c in cluster_centers:
                cluster_rgb = tuple(map(int, c))
                diff = delta_e_cie2000(rgb_to_lab(cluster_rgb), target_lab)
                if diff < best_diff:
                    best_diff = diff
                    best_cluster = cluster_rgb

            return target_hex, best_cluster, float(best_diff)
    except Exception as e:
        print(f"⚠️ Image processing failed: {e}")
        return None

# -----------------------------------
# Garment Agent
# -----------------------------------
class GarmentMatchAgent:
    def __init__(self, palette_hexs, store_url, gender="female", max_matches_per_color=MAX_MATCHES_PER_COLOR):
        self.palette_hexs = palette_hexs
        self.gender = gender.lower()
        self.max_matches_per_color = max_matches_per_color
        self.cpu_pool = ThreadPoolExecutor(max_workers=CPU_POOL_WORKERS)
        parsed = urlparse(store_url)
        self.domain = parsed.netloc or parsed.path
        self._ddgs = DDGS()
        # Keep original garment variety
        self.garments = ["dress", "shirt"] if self.gender == "female" else ["shirt", "kurta"]
        
        self.page_semaphore = asyncio.Semaphore(MAX_CONCURRENT_PAGES)
        self.image_semaphore = asyncio.Semaphore(MAX_CONCURRENT_IMAGES)

    async def _run_ddg_query(self, query, max_results=MAX_RESULTS_PER_QUERY):
        loop = asyncio.get_event_loop()
        def sync_query():
            out = []
            try:
                print(f"🔍 Searching: {query}")
                for r in self._ddgs.text(query, max_results=max_results):
                    href = r.get("href")
                    if href:
                        out.append(href)
                print(f"✓ Found {len(out)} URLs")
            except Exception as e:
                print(f"⚠️ Search error: {e}")
            return out
        return await loop.run_in_executor(self.cpu_pool, sync_query)

    async def _fetch_html(self, session, url):
        try:
            async with session.get(url, timeout=TIMEOUT_SECONDS, ssl=False) as resp:
                if resp.status == 200:
                    return await resp.text()
        except Exception as e:
            print(f"⚠️ Failed to fetch {url}: {e}")
            return None

    async def _fetch_image_bytes(self, session, url):
        try:
            async with session.get(url, timeout=TIMEOUT_SECONDS, ssl=False) as resp:
                if resp.status == 200:
                    return await resp.read()
        except Exception:
            return None

    async def _analyze_image_async(self, img_bytes, target_hex):
        async with self.image_semaphore:
            loop = asyncio.get_event_loop()
            return await loop.run_in_executor(self.cpu_pool, _process_image_bytes, img_bytes, target_hex)

    async def _process_product_page(self, session, href, target_hex):
        async with self.page_semaphore:
            html = await self._fetch_html(session, href)
            if not html:
                return None
            
            # Find all image URLs
            img_matches = re.findall(r'(https?://[^\s"\']+\.(?:jpg|jpeg|png|webp))', html)
            if not img_matches:
                return None
            
            # Try the first valid image
            img_url = img_matches[0]
            img_bytes = await self._fetch_image_bytes(session, img_url)
            if not img_bytes:
                return None
            
            res = await self._analyze_image_async(img_bytes, target_hex)
            if not res:
                return None
            
            _, dominant_rgb, diff = res
            print(f"  📊 Color distance: {diff:.2f} (threshold: {SIMILARITY_THRESHOLD})")
            
            if diff < SIMILARITY_THRESHOLD:
                os.makedirs("matched_images", exist_ok=True)
                filename = f"example_{hash(img_url) & 0xfffffff}.jpg"
                save_path = os.path.join("matched_images", filename)
                try:
                    with open(save_path, "wb") as f:
                        f.write(img_bytes)
                except Exception:
                    save_path = None
                
                print(f"✅ MATCH FOUND! Distance: {diff:.2f}")
                return {
                    "url": href,
                    "image_url": img_url,
                    "saved_image_path": save_path,
                    "color": target_hex,
                    "dominant": dominant_rgb,
                    "distance": diff
                }
            return None

    async def _process_color(self, color_hex, session):
        syns = get_color_synonyms_from_hex(color_hex)
        checked_links = set()
        hrefs_to_process = []
        
        # Run queries for top 2 synonyms + top 2 garments in parallel
        gender_prefix = "women" if self.gender == "female" else "men"
        queries = []
        
        for syn in syns[:2]:  # Top 2 color synonyms
            for garment in self.garments[:2]:  # Top 2 garments
                query = f"{gender_prefix} {syn} {garment} site:{self.domain}"
                queries.append(self._run_ddg_query(query, max_results=10))
        
        # Execute all searches concurrently
        results = await asyncio.gather(*queries, return_exceptions=True)
        
        for result in results:
            if isinstance(result, list):
                for href in result:
                    href_clean = href.split("?")[0]
                    if href_clean not in checked_links:
                        checked_links.add(href_clean)
                        # Check if URL looks like a product page
                        if ".html" in href_clean or "/product" in href_clean or "/p/" in href_clean:
                            hrefs_to_process.append(href_clean)
        
        print(f"🔗 Processing {len(hrefs_to_process)} product pages...")
        
        if not hrefs_to_process:
            print("⚠️ No product URLs found!")
            return []
        
        # Process pages concurrently with early exit on first match
        page_tasks = [
            asyncio.create_task(self._process_product_page(session, h, color_hex)) 
            for h in hrefs_to_process
        ]
        
        try:
            for coro in asyncio.as_completed(page_tasks):
                res = await coro
                if res:
                    # Found a match! Cancel remaining tasks
                    for task in page_tasks:
                        if not task.done():
                            task.cancel()
                    return [res]
        except Exception as e:
            print(f"⚠️ Error processing pages: {e}")
        
        return []

    async def run(self):
        connector = aiohttp.TCPConnector(limit=30, limit_per_host=10, ttl_dns_cache=300)
        timeout = aiohttp.ClientTimeout(total=60, connect=10)
        
        async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
            tasks = [self._process_color(color_hex, session) for color_hex in self.palette_hexs]
            results = []
            
            for coro in asyncio.as_completed(tasks):
                res = await coro
                if res:
                    results.extend(res)
            
            return results

    def close(self):
        try:
            self._ddgs.close()
        except Exception:
            pass
        self.cpu_pool.shutdown(wait=False)


async def run_garment_match(color_hex: str, store_url: str, gender: str = "female", max_matches_per_color: int = 1):
    agent = GarmentMatchAgent([color_hex], store_url, gender=gender, max_matches_per_color=max_matches_per_color)
    try:
        results = await agent.run()
        return results
    except asyncio.CancelledError:
        return []
    finally:
        agent.close()
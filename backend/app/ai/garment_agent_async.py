import asyncio
import re
import time
from io import BytesIO
from urllib.parse import urlparse

import aiohttp
import numpy as np
from ddgs import DDGS
from PIL import Image
from sklearn.cluster import KMeans
from skimage.color import rgb2lab, deltaE_ciede2000
from concurrent.futures import ThreadPoolExecutor

# -----------------------------------
# CONFIG
# -----------------------------------
GARMENT_WORDS = [
    "dress", "shirt", "kurta", "top", "blouse", "trouser", "scarf",
    "abaya", "maxi", "kameez", "shalwar", "co-ord", "suit", "pant", "tunic"
]

COLOR_SYNONYMS = {
    "#808000": ["olive", "khaki", "moss", "sage", "army green"],
    "#F5F5DC": ["beige", "sand", "camel", "cream", "ivory"],
    "#E2725B": ["terracotta", "rust", "brick", "clay"],
    "#FFDB58": ["mustard", "ochre", "golden"],
    "#000080": ["navy", "midnight", "indigo", "blue"],
    "#8B0000": ["red", "maroon", "crimson", "burgundy"],
    "#FFC0CB": ["pink", "blush", "rose"],
    "#000000": ["black", "charcoal"],
    "#FFFFFF": ["white", "ivory", "cream"],
    "#8B4513": ["brown", "camel", "tan", "chocolate"],
    "#FFA500": ["orange", "terracotta", "rust"],
}

# matching params
KMEANS_CLUSTERS = 3
KMEANS_N_INIT = 5
SIMILARITY_THRESHOLD = 25.0
MAX_RESULTS_PER_QUERY = 8
MAX_MATCHES_PER_COLOR = 2
CPU_POOL_WORKERS = 8

# -----------------------------------
# COLOR UTILS
# -----------------------------------
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

def find_closest_color_family(hex_color):
    target_lab = rgb_to_lab(hex_to_rgb(hex_color))
    best_key, best_dist = None, float("inf")
    for key_hex in COLOR_SYNONYMS.keys():
        d = delta_e_cie2000(target_lab, rgb_to_lab(hex_to_rgb(key_hex)))
        if d < best_dist:
            best_key, best_dist = key_hex, d
    return best_key, best_dist

# -----------------------------------
# IMAGE PROCESSING
# -----------------------------------
def _process_image_bytes(img_bytes, target_hex):
    try:
        img = Image.open(BytesIO(img_bytes)).convert("RGB")
        img_small = img.resize((100, 100))
        pixels = np.array(img_small).reshape(-1, 3)

        kmeans = KMeans(n_clusters=KMEANS_CLUSTERS, n_init=KMEANS_N_INIT, random_state=42)
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
    except Exception:
        return None

# -----------------------------------
# MAIN AGENT
# -----------------------------------
class GarmentMatchAgent:
    def __init__(self, palette_hexs, store_url, max_matches_per_color=MAX_MATCHES_PER_COLOR):
        self.palette_hexs = palette_hexs
        parsed = urlparse(store_url)
        self.domain = parsed.netloc or parsed.path
        if not self.domain:
            raise ValueError("Invalid store_url")
        self.max_matches_per_color = max_matches_per_color
        self.cpu_pool = ThreadPoolExecutor(max_workers=CPU_POOL_WORKERS)
        self._ddgs = DDGS()

    async def _run_ddg_query(self, query, max_results=MAX_RESULTS_PER_QUERY):
        loop = asyncio.get_event_loop()
        def sync_query():
            out = []
            try:
                for r in self._ddgs.text(query, max_results=max_results):
                    href = r.get("href")
                    if href:
                        out.append(href)
            except Exception:
                pass
            return out
        return await loop.run_in_executor(self.cpu_pool, sync_query)

    async def _fetch_html(self, session, url, timeout=10):
        try:
            async with session.get(url, timeout=timeout) as resp:
                if resp.status == 200:
                    return await resp.text()
        except Exception:
            return None

    async def _fetch_image_bytes(self, session, url, timeout=10):
        try:
            async with session.get(url, timeout=timeout) as resp:
                if resp.status == 200:
                    return await resp.read()
        except Exception:
            return None

    async def _analyze_image_async(self, img_bytes, target_hex):
        loop = asyncio.get_event_loop()
        res = await loop.run_in_executor(self.cpu_pool, _process_image_bytes, img_bytes, target_hex)
        return res

    async def _process_product_page(self, session, href, target_hex):
        html = await self._fetch_html(session, href)
        if not html:
            return None
        img_match = re.search(r'(https?://[^\s"\']+\.(?:jpg|jpeg|png))', html)
        if not img_match:
            return None
        img_url = img_match.group(1)
        img_bytes = await self._fetch_image_bytes(session, img_url)
        if not img_bytes:
            return None
        res = await self._analyze_image_async(img_bytes, target_hex)
        if not res:
            return None
        _, dominant_rgb, diff = res
        if diff < SIMILARITY_THRESHOLD:
            return {"url": href, "img": img_url, "color": target_hex, "dominant": dominant_rgb, "distance": diff}
        return None

    async def _process_color(self, color_hex, session):
        results = []
        family_hex, _ = find_closest_color_family(color_hex)
        syns = COLOR_SYNONYMS.get(family_hex, [])
        checked_links = set()

        for syn in syns:
            if len(results) >= self.max_matches_per_color:
                break
            for garment in GARMENT_WORDS:
                if len(results) >= self.max_matches_per_color:
                    break
                query = f"{syn} {garment} site:{self.domain}"
                hrefs = await self._run_ddg_query(query, max_results=MAX_RESULTS_PER_QUERY)
                if not hrefs:
                    continue

                html_links = []
                for href in hrefs:
                    href_clean = href.split("?")[0]
                    if href_clean.endswith(".html") and href_clean not in checked_links:
                        checked_links.add(href_clean)
                        html_links.append(href_clean)
                tasks = [self._process_product_page(session, h, color_hex) for h in html_links]
                if tasks:
                    done = await asyncio.gather(*tasks)
                    for item in done:
                        if item:
                            results.append(item)
                            if len(results) >= self.max_matches_per_color:
                                break
        return results

    async def run(self):
        async with aiohttp.ClientSession() as session:
            tasks = [self._process_color(color_hex, session) for color_hex in self.palette_hexs]
            all_results = await asyncio.gather(*tasks)
        flattened = [item for sub in all_results for item in sub]
        return flattened

    def close(self):
        try:
            self._ddgs.close()
        except Exception:
            pass
        self.cpu_pool.shutdown(wait=False)

# -----------------------------------
# ASYNC WRAPPER FOR FASTAPI
# -----------------------------------
async def run_garment_match(hex_color: str, store_url: str):
    agent = GarmentMatchAgent([hex_color], store_url, max_matches_per_color=2)
    try:
        results = await agent.run()
        return results
    finally:
        agent.close()

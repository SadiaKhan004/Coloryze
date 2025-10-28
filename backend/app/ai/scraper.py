import asyncio
import time
import requests
from urllib.parse import urlparse
from io import BytesIO
from ddgs import DDGS
from PIL import Image
import numpy as np
from skimage.color import rgb2lab, deltaE_ciede2000
import re
from sklearn.cluster import KMeans

# -----------------------------------
# CONFIGURATION
# -----------------------------------
GARMENT_WORDS = [
    "dress", "shirt", "kurta", "top", "blouse", "trouser", "scarf",
    "abaya", "maxi", "kameez", "shalwar", "co-ord", "suit", "pant", "tunic"
]

COLOR_SYNONYMS = {
    "#808000": ["olive", "khaki", "moss", "sage", "army green"],         # Olive
    "#F5F5DC": ["beige", "sand", "camel", "cream", "ivory"],            # Beige
    "#E2725B": ["terracotta", "rust", "brick", "clay"],                 # Terracotta
    "#FFDB58": ["mustard", "ochre", "golden"],                          # Mustard
    "#000080": ["navy", "midnight", "indigo", "blue"],                  # Navy
    "#8B0000": ["red", "maroon", "crimson", "burgundy"],                # Red
    "#FFC0CB": ["pink", "blush", "rose"],                               # Pink
    "#000000": ["black", "charcoal"],                                   # Black
    "#FFFFFF": ["white", "ivory", "cream"],                             # White
    "#8B4513": ["brown", "camel", "tan", "chocolate"],                  # Brown
    "#FFA500": ["orange", "terracotta", "rust"],                        # Orange
}

# -----------------------------------
# COLOR UTILITIES
# -----------------------------------

def hex_to_rgb(hex_color):
    print(f"         Converting hex {hex_color} to RGB...")
    hex_color = hex_color.strip("#")
    print(f"         Stripped hex: {hex_color}")
    rgb = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    print(f"         Converted RGB: {rgb}")
    return rgb

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
# IMAGE UTILITIES
# -----------------------------------

def fetch_image_and_get_dominant_color(url, target_hex):
    """
    Fetches product image, clusters pixels into 3 color groups,
    finds the average of each cluster, compares to target color (LAB),
    and returns (target_rgb, closest_cluster_rgb, diff) if a close match is found.
    """
    try:
        print(f"         Fetching HTML for {url}...")
        print(target_hex)
        html = requests.get(url, timeout=10).text
        print(f"         Fetched HTML for {url}")
        # 🖼️ Find first .jpg or .png URL
        img_match = re.search(r'(https?://[^\s"\']+\.(?:jpg|jpeg|png))', html)
        if not img_match:
            return None
        print(f"         Found image URL: {img_match.group(1)}")
        img_url = img_match.group(1)
        img_data = requests.get(img_url, timeout=10).content
        img = Image.open(BytesIO(img_data)).convert("RGB")
        img_small = img.resize((100, 100))
        pixels = np.array(img_small).reshape(-1, 3)
        print(f"         Processed image for color analysis.")
        # --- Cluster into 3 color groups ---
        kmeans = KMeans(n_clusters=3, n_init=5, random_state=42)
        kmeans.fit(pixels)
        cluster_centers = np.clip(kmeans.cluster_centers_, 0, 255)
        print(f"         Completed KMeans clustering.")
        # --- Convert target to LAB ---
        target_rgb = hex_to_rgb(target_hex)
        print(f"         Target RGB: {target_rgb}")
        target_lab = rgb_to_lab(target_rgb)
        print(f"         Target LAB: {target_lab}")

        # --- Compare each cluster to target color ---
        best_diff = float("inf")
        best_cluster = None

        print(f"         Comparing clusters to target color...")
        for c in cluster_centers:
            cluster_rgb = tuple(map(int, c))
            diff = delta_e_cie2000(rgb_to_lab(cluster_rgb), target_lab)
            if diff < best_diff:
                best_diff = diff
                best_cluster = cluster_rgb
                print(f"            New best cluster: {best_cluster} with ΔE={best_diff:.2f}")

        # --- Threshold for visual similarity ---
        if best_diff < 25:  # perceptual similarity threshold
            # return {
            #     "target_color": target_rgb,
            #     "dominant_color": best_cluster,
            #     "difference": best_diff
            # }
            print(f"         Found similar color cluster: {best_cluster} (ΔE={best_diff:.2f})")
            return target_hex, best_cluster, best_diff

        return None
    except Exception as e:
        print(f"⚠️ Error fetching image for {url}: {e}")
        return None

# -----------------------------------
# CORE SEARCH FUNCTION
# -----------------------------------

def ddg_search_product_pages(domain, palette_hexs, max_results_per_query=12):
    """
    Dynamically searches for product pages whose garment colors match given palette.
    - For each palette color:
      1. Find closest color family.
      2. Use its synonyms to search for garments on the store.
      3. Validate each .html URL by checking image and color match.
      4. Stop when 2 valid products per color found.
    """
    final_matches = []
    domain = domain.lower().replace("https://", "").replace("http://", "").strip("/")

    with DDGS() as ddgs:
        for hex_color in palette_hexs:

            # Step 1: find closest color family
            color_family_hex, dist_to_family = find_closest_color_family(hex_color)
            color_family_syns = COLOR_SYNONYMS[color_family_hex]
            found_for_color = 0
            # print(f"\nSearching for color {hex_color} (closest family: {color_family_hex})")
            for syn in color_family_syns:
                print(f"   Searching for '{syn}'...")
                checked_link=0
                if found_for_color >= 2:
                    break
                for garment in GARMENT_WORDS:
                    if found_for_color >= 2:
                        break
                    if checked_link >= 10:
                        break
                    checked_for_garment = 0
                    query = f"{syn} {garment} site:{domain}"

                    try:
                        for r in ddgs.text(query, max_results=max_results_per_query):
                            href = r.get("href")
                            if not href:
                                continue
                            href_clean = href.split("?")[0]

                            if not href_clean.endswith(".html"):
                                continue
                            checked_link += 1
                            checked_for_garment += 1
                            print(f"      Checking {href_clean}...")
                            # # Step 2: fetch image and check color similarity
                            hex_color, dominant_rgb, diff = fetch_image_and_get_dominant_color(href_clean, hex_color)
                            if not dominant_rgb:
                                continue

                            print(f"         Dominant RGB: {dominant_rgb}")
                            # dominant_lab = rgb_to_lab(dominant_rgb)
                            # palette_lab = rgb_to_lab(hex_to_rgb(hex_color))
                            # diff = delta_e_cie2000(dominant_lab, palette_lab)
                            print(f"         Color difference (ΔE): {diff:.2f}")
                              # similarity threshold
                            final_matches.append({
                                "url": href_clean,
                                "color": hex_color,
                                "dominant": dominant_rgb,
                                "distance": diff,
                            })
                            found_for_color += 1

                            if found_for_color >= 2:
                                break
                            print(f"         ✅ Match found! (ΔE={diff:.2f})")
                            if checked_for_garment >= 5:
                                break
                    except Exception as e:
                        print(f"         ⚠️ Error: {e}")
                        continue

            # if found_for_color < 2:
            #     print(f"     ⚠️ Only found {found_for_color} matches for color {hex_color}")
        return final_matches

# -----------------------------------
# MAIN AGENT FUNCTION
# -----------------------------------

def agent_find_matches(palette_hexs, store_url, max_candidates=200):
    t0 = time.time()
    parsed = urlparse(store_url)
    domain = parsed.netloc or parsed.path
    if not domain:
        raise ValueError("Invalid store_url")

    matches = ddg_search_product_pages(domain, palette_hexs)
    tf = time.time()

    return matches

# -----------------------------------
# MAIN EXECUTION
# -----------------------------------

if __name__ == "__main__":
    palette = ["#808000", "#8B0000", "#000080"]  # example: olive, camel, terracotta
    site = "https://www.khaadi.com/"
    matches = agent_find_matches(palette, site)
    print(f"\nFound {len(matches)} matching products:")
    for match in matches:
        print(f"- {match['url']} (color: {match['color']}, dominant: {match['dominant']})")

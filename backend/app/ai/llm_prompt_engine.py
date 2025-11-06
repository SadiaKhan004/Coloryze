# # from llm_prompt_engine import ColorAnalysisPromptEngine
# # from color_analyzer import analyze_skin_color, prepare_cv_data_for_llm

# # def generate_llm_report(image_path: str):
# #     """
# #     Analyze the image using CV and generate LLM color analysis report.
# #     Returns:
# #         dict: {
# #             "skinTone": str,
# #             "undertone": str,
# #             "summary": str,
# #             "colors": list[str]
# #         }
# #     """
# #     # Step 1: Run CV analysis
# #     cv_result = analyze_skin_color(image_path)

# #     # Step 2: Prepare data for LLM
# #     llm_data = prepare_cv_data_for_llm(cv_result)

# #     # Step 3: Generate report using LLM
# #     engine = ColorAnalysisPromptEngine()
# #     report_text = engine.generate_color_analysis(llm_data)

# #     # Step 4: Extract recommended colors from LLM data (season palette)
# #     season = llm_data["skin_analysis"]["season"]
# #     colors = engine.color_theory_context["seasonal_palettes"].get(season, {}).get("best_colors", [])

# #     return {
# #         "skinTone": cv_result["descriptor"],
# #         "undertone": cv_result["undertone"],
# #         "summary": report_text,
# #         "colors": colors
# #     }
# """
# LLM Prompt Engine for Coloryze
# Generates natural, human-understandable color analysis reports
# Enhanced with eye/hair color integration and gender-neutral language
# Based on professional color consultation research (2022-2025)
# """

# from groq import Groq
# import os
# from dotenv import load_dotenv

# class ColorAnalysisPromptEngine:
#     """
#     Generates sophisticated LLM prompts based on CV color analysis
#     Creates natural language reports with complete feature analysis
#     """

#     def __init__(self, api_key: str = None):
#         """Initialize engine and load API key"""
#         # Load .env early
#         load_dotenv(encoding='utf-8')

#         # Priority: passed api_key > environment variable
#         self.api_key = api_key or os.getenv("GROQ_API_KEY")
#         if not self.api_key:
#             raise ValueError(
#                 "GROQ_API_KEY not found!\n"
#                 "Please either:\n"
#                 "1. Create a .env file with: GROQ_API_KEY=your_key_here\n"
#                 "2. Set environment variable: export GROQ_API_KEY=your_key_here\n"
#                 "3. Pass api_key parameter: ColorAnalysisPromptEngine(api_key='your_key')"
#             )

#         # Initialize client
#         self.client = Groq(api_key=self.api_key)
#         self.model = "llama-3.3-70b-versatile"

#         # Load color theory context
#         self.color_theory_context = self._load_color_theory_context()
    
#     def _load_color_theory_context(self):
#         """
#         Complete color theory knowledge base with eye/hair color integration
#         """
#         return {
#             "monk_scale_info": {
#                 "description": "The Monk Skin Tone Scale (MST) is a 10-shade scale developed by Harvard sociologist Dr. Ellis Monk in partnership with Google (2022). It provides inclusive representation of all skin tones.",
#                 "levels": {
#                     1: "Porcelain / Very Light - Lightest skin tone with cool to neutral undertones",
#                     2: "Ivory / Fair - Very light skin with possible warm undertones",
#                     3: "Beige / Light - Light skin that tans easily",
#                     4: "Sand / Light Medium - Light medium skin with warm undertones",
#                     5: "Honey / Medium - Medium skin tone, warm to neutral",
#                     6: "Caramel / Medium Tan - Medium tan with golden undertones",
#                     7: "Chestnut / Tan - Tan to deep tan skin",
#                     8: "Mocha / Deep - Deep skin tone with rich undertones",
#                     9: "Espresso / Dark - Very dark skin tone",
#                     10: "Ebony / Very Dark - Deepest skin tone on the scale"
#                 }
#             },
#             "undertone_theory": {
#                 "cool": {
#                     "definition": "Cool undertones have pink, red, or bluish hues beneath the skin. Colors lean towards blue and purple spectrum.",
#                     "characteristics": [
#                         "Veins on wrist appear blue or purple",
#                         "Skin has pink, rose, or reddish undertones",
#                         "Silver and platinum metals look more flattering",
#                         "Hair naturally has ash or cool tones",
#                         "Burns easily in sun rather than tanning"
#                     ],
#                     "best_colors": {
#                         "main": ["Royal Blue", "Emerald Green", "Jewel Tones", "Berry Reds", "Cool Pinks", "Purples", "Lavender", "Navy", "Magenta"],
#                         "neutrals": ["True Black", "Pure White", "Cool Gray", "Charcoal", "Silver", "Icy Taupe"],
#                         "metals": ["Silver", "Platinum", "White Gold", "Rhodium"]
#                     },
#                     "avoid": ["Warm oranges", "Golden yellows", "Warm browns", "Khaki", "Olive green", "Rust"],
#                     "accessories": {
#                         "general": "Silver, platinum, white gold metals",
#                         "watches": "Silver-toned watches with cool metal finishes, leather straps in black or cool grays",
#                         "jewelry": "Silver, platinum, white gold pieces"
#                     }
#                 },
#                 "warm": {
#                     "definition": "Warm undertones have golden, peachy, or yellowish hues. Colors lean towards yellow, orange spectrum.",
#                     "characteristics": [
#                         "Veins on wrist appear green or olive",
#                         "Skin has peachy, golden, or yellowish undertones",
#                         "Gold and brass metals look more flattering",
#                         "Hair has golden, red, or warm tones naturally",
#                         "Tans easily with golden undertones"
#                     ],
#                     "best_colors": {
#                         "main": ["Warm Oranges", "Coral", "Warm Reds", "Golden Yellows", "Olive Greens", "Terracotta", "Rust", "Burnt Orange", "Peach"],
#                         "neutrals": ["Cream", "Beige", "Camel", "Warm Browns", "Tan", "Warm Grays", "Chocolate"],
#                         "metals": ["Gold", "Brass", "Rose Gold", "Copper", "Bronze"]
#                     },
#                     "avoid": ["Icy blues", "Cool pinks", "Pure white", "Silver tones", "Cool purples", "Blue-based reds"],
#                     "accessories": {
#                         "general": "Gold, brass, rose gold, copper, bronze metals",
#                         "watches": "Gold-toned watches, bronze, rose gold, leather straps in brown or warm tan",
#                         "jewelry": "Gold, brass, rose gold, copper pieces"
#                     }
#                 },
#                 "neutral": {
#                     "definition": "Neutral undertones have balanced cool and warm characteristics. Most versatile for colors.",
#                     "characteristics": [
#                         "Veins appear greenish-blue or balanced",
#                         "Skin is well-balanced without strong bias",
#                         "Both gold and silver metals look flattering",
#                         "Can have mixed tones in hair",
#                         "Adapts well to different color families"
#                     ],
#                     "best_colors": {
#                         "main": ["Soft Pastels", "True Colors", "Jewel Tones", "Earth Tones", "Jade", "Dusty Rose"],
#                         "neutrals": ["True Gray", "Soft White", "Warm Brown", "Cool Black", "Taupe", "Mushroom"],
#                         "metals": ["Gold", "Silver", "Mixed Metals", "Platinum", "Rose Gold", "Gunmetal"]
#                     },
#                     "avoid": ["Usually none - very versatile"],
#                     "accessories": {
#                         "general": "Both gold and silver work beautifully, mixed metals",
#                         "watches": "Any metal tone - silver, gold, two-tone, rose gold all work",
#                         "jewelry": "Complete versatility in metal choices"
#                     }
#                 }
#             },
#             "eye_color_analysis": {
#                 "Black": {
#                     "description": "Deep, dark eyes with little distinction between pupil and iris. Creates striking contrast.",
#                     "common_seasons": ["Deep Winter", "Deep Autumn", "Clear Winter"],
#                     "contrast_level": "High - especially with lighter skin tones",
#                     "best_colors": "Can wear bold, saturated colors. Deep jewel tones, rich earth tones",
#                     "makeup_tips": "Deep browns, charcoals, bronze, jewel-toned eyeshadows. Can wear dramatic looks.",
#                     "characteristics": "Adds intensity and depth. Works beautifully with high-contrast palettes."
#                 },
#                 "Dark Brown": {
#                     "description": "Rich brown eyes that may appear almost black in low light. Very versatile.",
#                     "common_seasons": ["Deep Winter", "Deep Autumn", "Warm Autumn", "Soft Autumn"],
#                     "contrast_level": "Medium to High",
#                     "best_colors": "Versatile - warm browns, bronze, copper for warm; cool taupes for cool",
#                     "makeup_tips": "Warm browns, bronze, copper for warm undertones. Cool taupes, mauves for cool",
#                     "characteristics": "Most common eye color. Flattering with most color palettes based on undertone."
#                 },
#                 "Light Brown": {
#                     "description": "Medium to light brown with possible golden or green flecks. Multi-tonal.",
#                     "common_seasons": ["Warm Autumn", "Warm Spring", "Soft Autumn", "Light Spring"],
#                     "contrast_level": "Medium to Low",
#                     "best_colors": "Warm earth tones, golden yellows, peaches, soft greens",
#                     "makeup_tips": "Enhance golden flecks with warm browns. Bring out depth with plum or bronze",
#                     "characteristics": "Can shift appearance in different lighting. Often has warmth and dimension."
#                 },
#                 "Dark Hazel": {
#                     "description": "Brown-green mix with golden or amber flecks. Rich and earthy.",
#                     "common_seasons": ["Deep Autumn", "Warm Autumn", "Soft Autumn"],
#                     "contrast_level": "Medium",
#                     "best_colors": "Warm earth tones, olive greens, rust, burnt orange, golden yellows",
#                     "makeup_tips": "Warm browns, olive greens, bronze, copper bring out the golden undertones",
#                     "characteristics": "Distinctly warm. Pairs beautifully with autumn color palettes."
#                 },
#                 "Light Hazel": {
#                     "description": "Light brown with green and gold flecks. Bright and multi-dimensional.",
#                     "common_seasons": ["Light Spring", "Warm Spring", "Soft Summer"],
#                     "contrast_level": "Low to Medium",
#                     "best_colors": "Warm pastels, peach, coral, soft greens, golden yellows",
#                     "makeup_tips": "Peach, coral, soft browns enhance warmth. Purple can bring out green tones",
#                     "characteristics": "Bright and lively. Works with lighter, warmer color palettes."
#                 },
#                 "Dark Green": {
#                     "description": "Deep, rich green eyes. Relatively rare and striking.",
#                     "common_seasons": ["Deep Autumn", "Soft Autumn", "Cool Summer"],
#                     "contrast_level": "Medium to High",
#                     "best_colors": "Burgundy, plum, deep reds, forest greens, browns",
#                     "makeup_tips": "Burgundy, plum, copper enhance green. Avoid matching green exactly",
#                     "characteristics": "Rare and beautiful. Enhanced by complementary warm reds and purples."
#                 },
#                 "Light Green": {
#                     "description": "Bright, clear green eyes. Eye-catching and vibrant.",
#                     "common_seasons": ["Light Spring", "Warm Spring", "Clear Spring"],
#                     "contrast_level": "Medium",
#                     "best_colors": "Warm pinks, peaches, corals, purples that complement green",
#                     "makeup_tips": "Purple, burgundy, copper. Avoid matching green shades",
#                     "characteristics": "Striking and rare. Works beautifully with spring palettes."
#                 },
#                 "Dark Blue": {
#                     "description": "Deep, saturated blue eyes. Strong and vibrant.",
#                     "common_seasons": ["Deep Winter", "Clear Winter", "Cool Summer"],
#                     "contrast_level": "High with darker hair",
#                     "best_colors": "Navy, royal blue, jewel tones, cool reds, crisp whites",
#                     "makeup_tips": "Navy, charcoal to enhance blue. Warm browns for contrast",
#                     "characteristics": "Striking with cool undertones. Enhanced by jewel tones."
#                 },
#                 "Light Blue": {
#                     "description": "Soft, clear blue eyes. Delicate and cool-toned.",
#                     "common_seasons": ["Light Summer", "Cool Summer", "Clear Winter"],
#                     "contrast_level": "Low to Medium",
#                     "best_colors": "Soft blues, lavenders, cool pinks, soft grays",
#                     "makeup_tips": "Soft browns, peaches for contrast. Navy, charcoal to enhance blue",
#                     "characteristics": "Soft and cool. Works with lighter, cooler color palettes."
#                 },
#                 "Gray": {
#                     "description": "True gray eyes, can appear blue-gray or green-gray. Chameleon-like.",
#                     "common_seasons": ["Cool Summer", "True Summer", "Soft Summer"],
#                     "contrast_level": "Low to Medium",
#                     "best_colors": "Soft grays, mauves, dusty blues, cool tones",
#                     "makeup_tips": "Soft grays, taupes, mauves. Can experiment with various cool tones",
#                     "characteristics": "Reflects surrounding colors. Versatile within cool palette."
#                 }
#             },
#             "hair_color_analysis": {
#                 "Black": {
#                     "description": "True black hair with blue or cool undertones. Creates high drama.",
#                     "common_seasons": ["Deep Winter", "Deep Autumn", "True Winter"],
#                     "contrast_level": "Very High with lighter skin",
#                     "best_colors": "Bold, saturated colors. Jewel tones, true black, pure white",
#                     "styling_tips": "Can wear dramatic, high-contrast colors. Jewel tones are stunning",
#                     "characteristics": "Creates maximum contrast. Pairs beautifully with bold color choices."
#                 },
#                 "Dark Brown": {
#                     "description": "Very dark brown that may appear black in certain lighting. Rich depth.",
#                     "common_seasons": ["Deep Winter", "Deep Autumn", "Soft Autumn"],
#                     "contrast_level": "High to Medium",
#                     "best_colors": "Rich, deep colors. Both warm and cool work based on undertone",
#                     "styling_tips": "Versatile - both warm earth tones and cool jewel tones can work",
#                     "characteristics": "Most common darker hair. Creates good contrast with lighter skin."
#                 },
#                 "Brown": {
#                     "description": "Medium brown with warm or cool undertones. Highly adaptable.",
#                     "common_seasons": ["Warm Autumn", "Soft Autumn", "Cool Summer", "Soft Summer"],
#                     "contrast_level": "Medium",
#                     "best_colors": "Depends on undertone - match hair undertone to clothing undertone",
#                     "styling_tips": "Look at hair undertone (ash vs golden) and match clothing accordingly",
#                     "characteristics": "Most common hair color globally. Very versatile."
#                 },
#                 "Dark Blonde": {
#                     "description": "Honey to dark golden blonde. Warm and sun-kissed.",
#                     "common_seasons": ["Light Spring", "Warm Spring", "Soft Autumn"],
#                     "contrast_level": "Low to Medium",
#                     "best_colors": "Warm tones - golden yellows, peaches, warm greens, earth tones",
#                     "styling_tips": "Golden, warm tones enhance natural warmth. Avoid icy cool colors",
#                     "characteristics": "Warm and sunny. Works with warm, lighter palettes."
#                 },
#                 "Blonde": {
#                     "description": "Light to medium blonde, can be warm (golden) or cool (ash).",
#                     "common_seasons": ["Light Spring", "Light Summer", "Warm Spring"],
#                     "contrast_level": "Low",
#                     "best_colors": "Soft, light tones. Warm if golden blonde, cool if ash blonde",
#                     "styling_tips": "Avoid overly dark, heavy colors. Soft, light tones work best",
#                     "characteristics": "Light and delicate. Needs softer color palettes to avoid being overwhelmed."
#                 },
#                 "Red": {
#                     "description": "Natural red or auburn with warm copper tones. Distinctive warmth.",
#                     "common_seasons": ["Warm Autumn", "Warm Spring", "Deep Autumn"],
#                     "contrast_level": "Medium",
#                     "best_colors": "Earth tones, warm greens, rust, terracotta, warm reds",
#                     "styling_tips": "Embrace warm earth tones. Avoid cool blues and pinks",
#                     "characteristics": "Distinctly warm. Makes a statement - colors should complement not compete."
#                 },
#                 "Gray": {
#                     "description": "Natural gray or white hair. Cool and neutral tones.",
#                     "common_seasons": "Often transitions to Summer or Winter palettes",
#                     "contrast_level": "Depends on skin tone",
#                     "best_colors": "Cool colors work well - silvers, cool pinks, blues, purples",
#                     "styling_tips": "Silver and cool tones are flattering. Avoid overly warm colors",
#                     "characteristics": "As hair grays, color palette often shifts cooler."
#                 }
#             },
#             "contrast_analysis": {
#                 "high_contrast": {
#                     "definition": "Significant difference between skin, hair, and eye colors. Striking appearance.",
#                     "examples": "Dark hair + light skin, dark eyes + light skin, light hair + dark eyes",
#                     "best_approach": "Can wear bold, saturated colors and high-contrast combinations",
#                     "colors": "True blacks, pure whites, jewel tones, bright colors",
#                     "styling": "Go bold! High contrast individuals can pull off dramatic color combinations"
#                 },
#                 "medium_contrast": {
#                     "definition": "Moderate difference between features. Balanced appearance.",
#                     "examples": "Medium brown hair + medium skin + brown eyes",
#                     "best_approach": "Works with medium-intensity colors, can do some contrast",
#                     "colors": "Medium-depth colors, balanced tones, some contrast is flattering",
#                     "styling": "Versatile - can do some bold looks but also softer combinations"
#                 },
#                 "low_contrast": {
#                     "definition": "Features are similar in depth and intensity. Gentle, harmonious appearance.",
#                     "examples": "Blonde hair + light skin + light eyes, dark hair + dark skin + dark eyes",
#                     "best_approach": "Soft, tonal color combinations work best",
#                     "colors": "Soft, muted tones, monochromatic looks, gentle colors",
#                     "styling": "Avoid harsh contrasts. Tonal dressing is most flattering"
#                 }
#             },
#             "seasonal_palettes": {
#                 "Deep Winter": {
#                     "profile": "MST 6-10, cool undertones, dark hair (black/dark brown), dark eyes, high contrast",
#                     "essence": "Dramatic, bold, high-contrast coloring with cool undertones",
#                     "best_colors": ["True Black (#000000)", "Pure White (#FFFFFF)", "Royal Blue (#4169E1)", "Emerald Green (#50C878)", "Deep Purple (#9B30FF)", "Magenta (#FF00FF)", "True Red (#DC143C)", "Navy (#000080)", "Charcoal (#36454F)", "Burgundy (#800020)"],
#                     "avoid": "Warm oranges, golden yellows, muted pastels, earth tones",
#                     "accessories": "Silver, platinum, white gold watches and accessories",
#                     "makeup": "Bold lips in berry, deep red. Dramatic eyes with jewel tones"
#                 },
#                 "Cool Summer": {
#                     "profile": "MST 3-6, cool undertones, ash brown/soft hair, soft eyes, medium contrast",
#                     "essence": "Soft, muted, cool-toned with gentle coloring",
#                     "best_colors": ["Soft Blue (#B0C4DE)", "Lavender (#E6E6FA)", "Dusty Rose (#B87792)", "Soft Pink (#FFB6C1)", "Mauve (#E0B0D5)", "Cocoa (#C88B63)", "Soft Gray (#C0C0C0)", "Powder Blue (#B0E0E6)", "Rose (#FF007F)", "Periwinkle (#CCCCFF)"],
#                     "avoid": "Bright, saturated colors, warm oranges, golden tones",
#                     "accessories": "Silver, white gold, rose gold with cool tones",
#                     "makeup": "Soft, muted colors. Rose, mauve, soft plum, cool brown"
#                 },
#                 "Light Summer": {
#                     "profile": "MST 1-3, cool undertones, light ash hair, light eyes, low contrast",
#                     "essence": "Lightest cool season with delicate, soft coloring",
#                     "best_colors": ["Soft White (#F5F5F5)", "Light Blue (#ADD8E6)", "Soft Pink (#FFB6C1)", "Lavender (#E6E6FA)", "Mint (#98FF98)", "Periwinkle (#CCCCFF)", "Cool Beige (#D3C0AA)", "Soft Gray (#D3D3D3)", "Sky Blue (#87CEEB)", "Rose Quartz (#F7CAC9)"],
#                     "avoid": "Dark, heavy colors, warm golden tones, high contrast",
#                     "accessories": "Silver, white gold, delicate finishes",
#                     "makeup": "Light, soft colors. Pink, rose, soft taupe"
#                 },
#                 "Deep Autumn": {
#                     "profile": "MST 6-10, warm undertones, dark warm hair, deep eyes, high contrast",
#                     "essence": "Rich, warm, earthy with depth and intensity",
#                     "best_colors": ["Rust (#B7410E)", "Burnt Orange (#CC5500)", "Deep Olive (#556B2F)", "Warm Brown (#8B4513)", "Terracotta (#E2725B)", "Deep Teal (#008080)", "Mustard (#FFDB58)", "Warm Burgundy (#800020)", "Chocolate (#3B2414)", "Forest Green (#228B22)"],
#                     "avoid": "Icy colors, cool pinks, pure white, silver tones",
#                     "accessories": "Gold, brass, copper, bronze watches and accessories",
#                     "makeup": "Rich warm tones. Terracotta, bronze, copper"
#                 },
#                 "Warm Autumn": {
#                     "profile": "MST 4-7, warm undertones, warm hair, warm eyes, medium contrast",
#                     "essence": "Warmest season with golden, earthy tones",
#                     "best_colors": ["Olive Green (#808000)", "Rust (#B7410E)", "Warm Brown (#8B4513)", "Orange (#FFA500)", "Mustard (#FFDB58)", "Terracotta (#E2725B)", "Warm Red (#DC143C)", "Camel (#C19A6B)", "Pumpkin (#FF7518)", "Golden Yellow (#FFD700)"],
#                     "avoid": "Cool blues, icy pinks, gray, black, pure white",
#                     "accessories": "Gold, brass, copper, warm metals",
#                     "makeup": "Warm earth tones. Bronze, copper, terracotta"
#                 },
#                 "Soft Autumn": {
#                     "profile": "MST 4-6, neutral-warm, muted hair, soft eyes, low contrast",
#                     "essence": "Soft, muted warmth with gentle coloring",
#                     "best_colors": ["Soft Olive (#6B8E23)", "Warm Taupe (#B38B6D)", "Soft Brown (#A0826D)", "Muted Orange (#CC7722)", "Soft Teal (#5F9EA0)", "Dusty Rose (#B87792)", "Mushroom (#A99A86)", "Sage Green (#9CAF88)", "Moss (#8A9A5B)", "Mocha (#967969)"],
#                     "avoid": "Bright saturated colors, pure white, black",
#                     "accessories": "Antique gold, bronze, copper, muted metals",
#                     "makeup": "Soft muted warm tones. Taupe, soft brown"
#                 },
#                 "Light Spring": {
#                     "profile": "MST 1-4, warm undertones, light golden hair, light eyes, low contrast",
#                     "essence": "Lightest warm season with fresh, delicate coloring",
#                     "best_colors": ["Peach (#FFDAB9)", "Coral (#FF7F50)", "Light Golden Yellow (#FFFFE0)", "Warm Pink (#FFB6C1)", "Light Warm Green (#90EE90)", "Aqua (#00FFFF)", "Cream (#FFFDD0)", "Light Apricot (#FBCEB1)", "Soft Turquoise (#AFEEEE)", "Buttercup (#F3E96B)"],
#                     "avoid": "Dark heavy colors, cool tones, black, pure white",
#                     "accessories": "Gold, yellow gold, warm delicate metals",
#                     "makeup": "Light warm colors. Peach, coral, warm pink"
#                 },
#                 "Warm Spring": {
#                     "profile": "MST 2-5, warm undertones, golden/auburn hair, warm eyes, medium contrast",
#                     "essence": "Warm, bright, clear with vibrant coloring",
#                     "best_colors": ["Coral (#FF7F50)", "Bright Orange (#FF8C00)", "Warm Yellow (#FFFF00)", "Warm Red (#DC143C)", "Turquoise (#40E0D0)", "Bright Warm Green (#7CFC00)", "Peach (#FFDAB9)", "Golden (#FFD700)", "Salmon (#FA8072)", "Lime (#00FF00)"],
#                     "avoid": "Muted colors, cool tones, black",
#                     "accessories": "Gold, yellow gold, bright warm metals",
#                     "makeup": "Bright warm colors. Coral, peach, bronze"
#                 },
#                 "Clear Spring": {
#                     "profile": "MST 2-5, warm undertones, bright clear features, high contrast",
#                     "essence": "Bright, clear warm coloring with contrast",
#                     "best_colors": ["True Red (#DC143C)", "Bright Coral (#FF6F61)", "Clear Yellow (#FFFF00)", "Bright Turquoise (#00CED1)", "Clear Green (#00FF00)", "Bright Pink (#FF69B4)", "Orange (#FFA500)", "Royal Blue (#4169E1)", "Purple (#800080)", "Emerald (#50C878)"],
#                     "avoid": "Muted dusty colors, overly soft pastels",
#                     "accessories": "Gold, polished metals, bright finishes",
#                     "makeup": "Clear bright colors. True red, coral"
#                 },
#                 "True Winter": {
#                     "profile": "MST 3-7, cool undertones, high contrast, clear features",
#                     "essence": "Cool, clear, high-contrast coloring",
#                     "best_colors": ["True Black (#000000)", "Pure White (#FFFFFF)", "Royal Blue (#4169E1)", "True Red (#DC143C)", "Emerald (#50C878)", "Fuchsia (#FF00FF)", "Icy Pink (#FFB6C1)", "Navy (#000080)", "Purple (#800080)", "Turquoise (#40E0D0)"],
#                     "avoid": "Warm muted colors, golden tones, earth tones",
#                     "accessories": "Silver, platinum, bright white metals",
#                     "makeup": "Bold clear colors. True red, fuchsia"
#                 },
#                 "True Summer": {
#                     "profile": "MST 3-6, cool undertones, medium contrast, gentle features",
#                     "essence": "Soft, cool, muted coloring",
#                     "best_colors": ["Soft Blue (#B0C4DE)", "Rose (#FF007F)", "Lavender (#E6E6FA)", "Soft Pink (#FFB6C1)", "Cocoa (#C88B63)", "Blue-Gray (#6699CC)", "Mauve (#E0B0D5)", "Periwinkle (#CCCCFF)", "Dusty Blue (#738FA7)", "Lilac (#C8A2C8)"],
#                     "avoid": "Warm golden tones, bright oranges",
#                     "accessories": "Silver, rose gold with cool tones, pewter",
#                     "makeup": "Soft cool tones. Rose, mauve, taupe"
#                 },
#                 "Clear Winter": {
#                     "profile": "MST 2-6, cool undertones, very high contrast, bright coloring",
#                     "essence": "Cool with highest contrast and clarity",
#                     "best_colors": ["Icy White (#F0FFFF)", "True Black (#000000)", "Bright Blue (#0000FF)", "Magenta (#FF00FF)", "Clear Red (#DC143C)", "Emerald (#50C878)", "Hot Pink (#FF69B4)", "Purple (#800080)", "Turquoise (#40E0D0)", "Violet (#8F00FF)"],
#                     "avoid": "Muted warm colors, earth tones",
#                     "accessories": "Silver, platinum, icy metals",
#                     "makeup": "Bold clear cool colors. Fuchsia, bright red"
#                 }
#             }
#         }
    
#     def create_analysis_prompt(self, cv_data):
#         """
#         Create comprehensive prompt including eye and hair color analysis
#         """
#         skin = cv_data["skin_analysis"]
#         eye = cv_data.get("eye_analysis", {})
#         hair = cv_data.get("hair_analysis", {})
#         contrast = cv_data.get("contrast_level", "medium")
        
#         # Get context from knowledge base
#         undertone_info = self.color_theory_context["undertone_theory"][skin['undertone']]
#         season_info = self.color_theory_context["seasonal_palettes"].get(skin['season'], {})
#         eye_info = self.color_theory_context["eye_color_analysis"].get(eye.get('color', ''), {})
#         hair_info = self.color_theory_context["hair_color_analysis"].get(hair.get('color', ''), {})
#         contrast_info = self.color_theory_context["contrast_analysis"].get(f"{contrast}_contrast", {})
        
#         system_prompt = """You are an expert color consultant specializing in comprehensive color analysis. Your expertise includes:
# - Monk Skin Tone Scale and inclusive beauty analysis
# - 12-season color analysis system
# - Eye and hair color integration in color palettes
# - Skin undertone science and color theory
# - Gender-neutral styling and accessory recommendations
# - Professional wardrobe building and personal styling

# Your reports are warm, educational, and empowering. You use gender-neutral language, replacing "jewelry" with "accessories and watches" for versatility."""

#         user_prompt = f"""Create a comprehensive, personalized color analysis report based on these features:

# ## COMPLETE FEATURE ANALYSIS:

# ### Skin Analysis:
# - Monk Skin Tone: {skin['mst_level']} - {skin['descriptor']}
# - Tone Group: {skin['tone_group']}
# - Undertone: {skin['undertone'].upper()}
# - Color Season: {skin['season']}

# ### Eye Color: {eye.get('color', 'Not specified')}
# {eye_info.get('description', '')}
# Common Seasons: {', '.join(eye_info.get('common_seasons', []))}
# Creates {eye_info.get('contrast_level', 'medium')} contrast

# ### Hair Color: {hair.get('color', 'Not specified')}
# {hair_info.get('description', '')}
# Common Seasons: {', '.join(hair_info.get('common_seasons', []))}

# ### Overall Contrast: {contrast.upper()}
# {contrast_info.get('definition', '')}

# ## COLOR THEORY FOUNDATION:

# ### Your {skin['undertone'].upper()} Undertone:
# {undertone_info['definition']}

# Key Characteristics:
# {chr(10).join(f"- {char}" for char in undertone_info['characteristics'])}

# Recommended Color Family:
# Main Colors: {', '.join(undertone_info['best_colors']['main'])}
# Neutrals: {', '.join(undertone_info['best_colors']['neutrals'])}
# Metals: {', '.join(undertone_info['best_colors']['metals'])}

# Colors to Avoid: {', '.join(undertone_info['avoid'])}

# ## SEASONAL PALETTE INSIGHT:
# {skin['season']} Essence: {season_info.get('essence', 'N/A')}
# Best Colors: {', '.join(season_info.get('best_colors', []))}
# Avoid Colors: {season_info.get('avoid', 'N/A')}
# Accessory Preference: {season_info.get('accessories', 'N/A')}
# Makeup Guidance: {season_info.get('makeup', 'N/A')}

# ## TONE & STYLE:
# - Warm, friendly, and encouraging
# - Use "you" and "your" to make it personal
# - Avoid overly technical language (explain any color theory simply)
# - Include confidence-building statements
# - Be specific with color names and hex codes
# - Make recommendations clear and actionable
# - Keep total length between 800-1200 words

# ## FINAL OUTPUT REQUIREMENTS:
# - Use gender-neutral tone
# - Mention suitable wardrobe colors
# - Include accessories and watch metal suggestions
# - Hex codes in format #XXXXXX
# - Describe overall harmony between skin, hair, and eye color
# - Write like a professional stylist’s personalized consultation report
# """

#         return {"system": system_prompt, "user": user_prompt}

#     def generate_color_analysis(self, cv_data):
#         """
#         Sends constructed prompt to LLM and returns detailed color analysis report
#         """
#         prompts = self.create_analysis_prompt(cv_data)
        
#         try:
#             completion = self.client.chat.completions.create(
#                 model=self.model,
#                 messages=[
#                     {"role": "system", "content": prompts["system"]},
#                     {"role": "user", "content": prompts["user"]}
#                 ],
#                 temperature=0.8,
#                 max_tokens=1500,
#                 top_p=0.9
#             )
            
#             # Access the content directly from the message object
#             return completion.choices[0].message.content
            
#         except Exception as e:
#             return f"[Error] Failed to generate color analysis: {str(e)}"


# # Example usage
# if __name__ == "__main__":
#     import sys
#     from color_analyzer import analyze_skin_color, prepare_cv_data_for_llm
    
#     if len(sys.argv) < 2:
#         print("Usage: python llm_prompt_engine.py path/to/your/image.jpg")
#         sys.exit(1)
        
#     image_path = sys.argv[1]
#     try:
#         # Run the CV analysis
#         cv_data = analyze_skin_color(image_path)
        
#         # Prepare data for LLM
#         llm_data = prepare_cv_data_for_llm(cv_data)
        
#         # Generate the report
#         engine = ColorAnalysisPromptEngine()
#         report = engine.generate_color_analysis(llm_data)
        
#         print("\n=== Color Analysis Report ===\n")
#         print(report)
        
#     except Exception as e:
#         print(f"Error analyzing image: {str(e)}")
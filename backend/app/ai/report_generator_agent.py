

from smolagents import Tool
from groq import Groq
import os
import json
import re


class FinalAnswerTool(Tool):
    """
    Generates a personalized color analysis report and recommended color palette
    based on scraped fashion color theory data and AI-detected user features
    (skin tone, undertone, hair, and eye color).
    """

    name = "final_answer_tool"
    description = (
        "Generates a personalized color analysis report and recommended color palette "
        "based on scraped general information and AI-detected user features."
    )

    inputs = {
        "scraped_text": {
            "type": "string",
            "description": "The combined text scraped from all web pages (generic color info).",
        },
        "ai_result": {
            "type": "object",
            "description": "User's AI color features (skin tone, undertone, hair, eyes).",
            "nullable": True,
        },
    }
    output_type = "string"

    def __init__(self):
        super().__init__()
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    # ==========================================================
    # 🎨 Improved Seasonal Logic (AJE-inspired)
    # ==========================================================
    def _determine_color_season(self, undertone, tone_group, hair, eye):
        undertone = str(undertone).lower()
        tone_group = str(tone_group).lower()
        hair = str(hair).lower()
        eye = str(eye).lower()

        # --- Warm undertones ---
        if "warm" in undertone:
            if any(t in tone_group for t in ["fair", "light"]) or "blonde" in hair:
                return "Light Spring"
            elif any(t in tone_group for t in ["medium", "tan"]) and ("golden" in hair or "brown" in hair):
                return "Warm Spring"
            elif "deep" in tone_group or "dark" in hair:
                return "Deep Autumn"
            else:
                return "True Autumn"

        # --- Cool undertones ---
        elif "cool" in undertone:
            if any(t in tone_group for t in ["fair", "light"]) or "blue" in eye or "grey" in eye:
                return "Light Summer"
            elif any(t in tone_group for t in ["medium"]) or "brown" in hair:
                return "Cool Summer"
            elif "deep" in tone_group or "black" in hair:
                return "Deep Winter"
            else:
                return "True Winter"

        # --- Neutral undertones ---
        elif "neutral" in undertone:
            if any(t in tone_group for t in ["light", "fair"]):
                return "Soft Summer"
            elif any(t in tone_group for t in ["medium", "tan"]):
                return "Soft Autumn"
            elif "deep" in tone_group or "dark" in hair:
                return "Soft Winter"
            else:
                return "Neutral Blend"

        return "Balanced Season Type"

    # ==========================================================
    # 🧩 Main Report Generation
    # ==========================================================
    def forward(self, scraped_text: str, ai_result=None) -> str:
        try:
            # --------------------------
            # Parse & validate input
            # --------------------------
            if isinstance(ai_result, str):
                ai_result = json.loads(ai_result)

            skin = ai_result.get("skin_tone", "Unknown") if ai_result else "Unknown"
            undertone = ai_result.get("undertone", "Unknown") if ai_result else "Unknown"
            tone_group = ai_result.get("tone_group", "Unknown") if ai_result else "Unknown"
            hair = ai_result.get("hair_color", "Unknown") if ai_result else "Unknown"
            eye = ai_result.get("eye_color", "Unknown") if ai_result else "Unknown"

            if isinstance(eye, list):
                eye = " and ".join(eye)

            # Determine color season
            determine_season = self._determine_color_season(undertone, tone_group, hair, eye)

            # --------------------------
            # Profile summary
            # --------------------------
            profile_intro = f"""
User Profile:
- Skin Tone: {skin}
- Tone Group: {tone_group}
- Undertone: {undertone}
- Hair Color: {hair}
- Eye Color: {eye}
- Determined Season: {determine_season}
"""

            # ==========================================================
            # 📝 Prompt for LLM (keep your original prompt intact)
            # ==========================================================
            prompt = f"""
You are a certified personal color analyst trained in both the **Monk Skin Tone Scale**
and **AJE’s fashion-based seasonal color system**. Using the information below, generate
a **personalized Coloryze report** that combines scientific analysis with real styling insights.

{profile_intro}

Scraped Research Data (Color Theory & Fashion Guidance):
{scraped_text[:4500]}

YOUR TASK:
1️⃣ First, provide a COLOR PALETTE as plain JSON only, without any markdown, code blocks, or extra formatting. Include main_colors, neutrals, and metallics with hex codes.
2️⃣ Then, write a detailed PERSONAL COLOR REPORT as plain text, without any markdown, headings, or formatting symbols.

---

SECTION 1: COLOR PALETTE (JSON FORMAT)
```json
{{
  "main_colors": [
    {{"name": "Color Name", "hex": "#HEXCODE"}},
    {{"name": "Color Name", "hex": "#HEXCODE"}},
    {{"name": "Color Name", "hex": "#HEXCODE"}},
    {{"name": "Color Name", "hex": "#HEXCODE"}},
    {{"name": "Color Name", "hex": "#HEXCODE"}},
    {{"name": "Color Name", "hex": "#HEXCODE"}},
    {{"name": "Color Name", "hex": "#HEXCODE"}},
    {{"name": "Color Name", "hex": "#HEXCODE"}},
    {{"name": "Color Name", "hex": "#HEXCODE"}},
    {{"name": "Color Name", "hex": "#HEXCODE"}}
  ],
  "neutrals": [
    {{"name": "Neutral Name", "hex": "#HEXCODE"}},
    {{"name": "Neutral Name", "hex": "#HEXCODE"}}
  ],
  "metallics": [
    {{"name": "Metallic Name", "hex": "#HEXCODE"}},
    {{"name": "Metallic Name", "hex": "#HEXCODE"}}
  ]
}}
SECTION 2: PERSONALIZED REPORT

🎨 Your Personal Color Analysis Report
📊 Your Color Profile

Monk Skin Tone Level: {skin}
Tone Group: {tone_group}
Undertone: {undertone}
Hair: {hair}
Eyes: {eye}
Season: {determine_season}

🌈 Understanding Your Season

Describe the {determine_season} palette based on AJE’s system:

For warm undertones, reference Spring/Autumn hues (golden, peachy, earthy).

For cool undertones, reference Summer/Winter hues (rosy, icy, jewel tones).

Explain how {hair} hair and {eye} eyes enhance this palette.

Provide 3–4 bullet points summarizing their seasonal traits (temperature, contrast, intensity, best fabrics).

✨ Your Perfect Color Palette

Explain how each color group (main, neutrals, metallics) works harmoniously.

🎯 Colors to Approach with Caution

Explain colors that might clash with {undertone} undertones or {hair} hair contrast.

💡 Styling & Makeup Guidance

Offer simple styling tips (outfit pairings, metals, flattering contrasts).

🛍 Smart Shopping Tips

Include advice for shopping by color palette and testing under light.

💪 Final Color Confidence

End with a motivational message about individuality and color confidence.

Formatting:

Markdown headings (##, ###)

Bullet points

Professional yet friendly tone

Length: ~800–1200 words
"""

            # ==========================================================
            # 🧠 Run Groq LLM for report generation
            # ==========================================================
            try:
                response = self.client.chat.completions.create(
                    model="openai/gpt-oss-20b",
                    messages=[
                        {"role": "system", "content": "You are an expert personal color consultant."},
                        {"role": "user", "content": prompt},
                    ],
                    temperature=0.7,
                    max_tokens=4000,
                )
            except Exception as e:
                print(f"⚠️ GPT OSS unavailable, falling back to Llama 3.3 70B: {e}")
                response = self.client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": "You are an expert personal color consultant."},
                        {"role": "user", "content": prompt},
                    ],
                    temperature=0.7,
                    max_tokens=2500,
                )

            result_text = response.choices[0].message.content.strip()

            # ==========================================================
            # 🧾 Parse LLM output (extract JSON + report)
            # ==========================================================
            palette_json = {"main_colors": [], "neutrals": [], "metallics": []}
            json_match = re.search(r"```json\s*(\{.*?\})\s*```", result_text, re.DOTALL)

            if json_match:
                try:
                    json_str = json_match.group(1)
                    palette_json = json.loads(json_str)
                except Exception as e:
                    print(f"❌ Failed to parse palette JSON: {e}")
            else:
                fallback_match = re.search(r"(\{.*\})", result_text, re.DOTALL)
                if fallback_match:
                    try:
                        palette_json = json.loads(fallback_match.group(1))
                    except json.JSONDecodeError:
                        pass

            # Extract Section 2: Report (everything after JSON)
            # report_text = result_text
            # if json_match:
            #     report_text = result_text[json_match.end():].strip()

            # # Remove any leftover section titles, code blocks, or emojis from Section 2
            # report_text = re.sub(r"SECTION\s*2.*", "", report_text, flags=re.IGNORECASE).strip()
            # report_text = re.sub(r"```.*?```", "", report_text, flags=re.DOTALL).strip()
            # report_text = re.sub(r"[🎨📊✨🎯💡🛍💪]", "", report_text).strip()

            # Extract Section 2: Report (everything after JSON)
            report_text = result_text
            if json_match:
                report_text = result_text[json_match.end():].strip()

            # Remove section headers, emojis, and bullets
            report_text = re.sub(r"(SECTION\s*2.*|🎨|📊|✨|🎯|💡|🛍|💪)", "", report_text, flags=re.IGNORECASE)
            report_text = re.sub(r"[-*]\s+", "", report_text)  # remove bullets like "- " or "* "
            report_text = re.sub(r"#+", "", report_text)       # remove any markdown headers
            report_text = re.sub(r"\n{2,}", "\n\n", report_text).strip()  # normalize multiple newlines

            # ==========================================================
            # ✅ Return structured final output
            # ==========================================================
            return json.dumps(
                {
                    "status": "success",
                    "recommended_palette": palette_json,
                    "final_report": report_text,
                }
            )

        except Exception as e:
            return json.dumps(
                {
                    "status": "error",
                    "recommended_palette": {
                        "main_colors": [],
                        "neutrals": [],
                        "metallics": [],
                    },
                    "final_report": f"Error: Failed to generate report. Reason: {str(e)}",
                }
            )

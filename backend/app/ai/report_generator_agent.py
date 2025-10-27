
from smolagents import Tool
from groq import Groq
import os
import json


class FinalAnswerTool(Tool):
    name = "final_answer_tool"
    description = (
        "Generates a personalized color analysis report "
        "and recommended color palette based on scraped data and user features."
    )

    inputs = {
        "scraped_text": {
            "type": "string",
            "description": "The combined text scraped from all web pages."
        },
        "ai_result": {
            "type": "object",
            "description": "User's AI color features (skin, hair, eyes, undertone).",
            "nullable": True
        }
    }
    output_type = "object"  # returning both palette + report

    def __init__(self):
        super().__init__()
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    def forward(self, scraped_text: str, ai_result: dict = None) -> dict:
        """
        Generates a personalized Coloryze color analysis report and color palette.
        """
        try:
            # Extract user profile data safely
            skin = ai_result.get("skin_tone", "Unknown") if ai_result else "Unknown"
            undertone = ai_result.get("undertone", "Unknown") if ai_result else "Unknown"
            tone_group = ai_result.get("tone_group", "Unknown") if ai_result else "Unknown"
            hair = ai_result.get("hair_color", "Unknown") if ai_result else "Unknown"
            eye = ai_result.get("eye_color", "Unknown") if ai_result else "Unknown"

            if isinstance(eye, list):
                eye = " and ".join(eye)

            profile_intro = f"""
User Profile:
- Skin Tone: {skin}
- Tone Group: {tone_group}
- Undertone: {undertone}
- Hair Color: {hair}
- Eye Color: {eye}
"""

            #  Ask LLM to generate JSON color palette + report text
            prompt = f"""
You are a certified color analyst and fashion consultant.
Your task is to generate **two outputs** for the given user:

1. A structured **recommended color palette** (as JSON) containing:
   - "main_colors": [{{
        "name": "Warm Coral", "hex": "#FF7F50"
     }}]
   - "neutrals": [...]
   - "metallics": [...]
   Include 5–8 colors per group, focusing on the undertone and personal tone group.

2. A **personalized color analysis report** — a friendly and expert-level consultation-style message.

User details:
{profile_intro}

Below is the scraped data from relevant color analysis sources:
{scraped_text[:4500]}

Return your result **strictly** in this format:
### COLOR_PALETTE_JSON
<valid JSON of the palette>
### END_PALETTE_JSON
### PERSONAL_REPORT
<the full report in markdown or plain text>
### END_PERSONAL_REPORT
"""

            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert personal color consultant specializing in tone, undertone, and palette recommendations."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000,
            )

            result_text = response.choices[0].message.content.strip()

            # Extract JSON palette and report
            palette_json = {}
            report_text = result_text

            if "### COLOR_PALETTE_JSON" in result_text:
                try:
                    palette_part = result_text.split("### COLOR_PALETTE_JSON")[1].split("### END_PALETTE_JSON")[0].strip()
                    palette_json = json.loads(palette_part)
                except Exception as e:
                    print(f"⚠️ Failed to parse color palette JSON: {e}")
                    palette_json = {}

            if "### PERSONAL_REPORT" in result_text:
                report_text = result_text.split("### PERSONAL_REPORT")[1].split("### END_PERSONAL_REPORT")[0].strip()

            # ✅ Console output
            print("\n===============================")
            print(" RECOMMENDED COLOR PALETTE")
            print("===============================\n")
            print(json.dumps(palette_json, indent=2))
            print("\n===============================")
            print(" FINAL COLORYZE REPORT (PERSONALIZED)")
            print("===============================\n")
            print(report_text)
            print("\n===============================\n")

            return {
                "status": "success",
                "recommended_palette": palette_json,
                "final_report": report_text
            }

        except Exception as e:
            print(f" Error generating personalized report: {e}")
            fallback = {
                "status": "error",
                "recommended_palette": {},
                "final_report": (
                    "### Coloryze Personal Color Analysis Report (Fallback) ###\n\n"
                    f"The AI summary could not be generated. Here's a preview of collected insights:\n\n"
                    f"{scraped_text[:2000]}..."
                )
            }
            return fallback

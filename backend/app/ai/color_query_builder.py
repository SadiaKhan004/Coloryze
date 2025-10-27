def build_color_queries(ai_result):
    """
    Build targeted web search queries for personal color analysis.
    Focuses on fashion, beauty, and seasonal color systems only.
    """

    skin = ai_result.get("skin_tone", "").replace("MST ", "").lower().strip()
    undertone = ai_result.get("undertone", "").lower().strip()
    tone_group = ai_result.get("tone_group", "").lower().strip()
    hair = ai_result.get("hair_color", "").lower().strip()
    eye = ai_result.get("eye_color", "")

    # Handle eye_color if it's a list (e.g. ["gray", "black"])
    if isinstance(eye, list):
        eye_str = " ".join([e.lower().strip() for e in eye])
    else:
        eye_str = eye.lower().strip()

    # ✅ Simplified, more focused queries
    queries = [
        # Seasonal color analysis (highly relevant)
        f"{undertone} undertone seasonal color palette",
        f"{tone_group} skin tone color season fashion",
        
        # Specific feature-based queries
        f"{undertone} undertone {hair} hair best colors",
        f"{eye_str} eyes {undertone} skin wardrobe colors",
        
        # General color analysis queries
        f"personal color analysis {undertone} undertone guide",
        f"{tone_group} complexion flattering colors makeup",
        
        # Seasonal system queries
        f"spring summer autumn winter color palette {undertone}",
        f"seasonal color theory {hair} hair {eye_str} eyes"
    ]

    return queries
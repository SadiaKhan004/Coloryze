from google import genai
from PIL import Image
from io import BytesIO
import os
import tempfile

client = genai.Client(api_key=os.getenv("gen_ai"))

async def generate_virtual_tryon(user_image_bytes: bytes, garment_image_bytes: bytes) -> bytes:
    """
    Takes the user image and garment image (in bytes),
    runs Gemini to perform background isolation + virtual try-on,
    and returns the generated try-on image as bytes.
    """

    user_image = Image.open(BytesIO(user_image_bytes))
    garment_image = Image.open(BytesIO(garment_image_bytes))

    # --- STEP 1: Isolate garment ---
    garment_prompt = """
    Remove any person, mannequin, background, or body parts like hands and feet associated with the garment.
    Extract only the full garment from this image. Include trousers, pants or lower garments if visible.
    Place the isolated garment on a pure white or transparent background.
    Maintain the original folds, textures, and details of the garment.
    """

    print("🪄 Extracting garment...")
    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[garment_image, garment_prompt],
    )

    if not response.candidates:
        raise Exception("⚠️ No garment image returned by Gemini model.")

    image_parts = [
        part.inline_data.data
        for part in response.candidates[0].content.parts
        if getattr(part, "inline_data", None)
    ]

    if not image_parts:
        raise Exception("⚠️ Gemini did not return a valid garment image.")

    garment_clean = Image.open(BytesIO(image_parts[0]))

    # --- STEP 2: Generate try-on result ---
    tryon_prompt = """
    You are a precision AI virtual stylist.
    Use the first image (extracted garment) and realistically apply it onto the person in the second image.
    """

    print("🪄 Generating virtual try-on...")
    response2 = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[garment_clean, user_image, tryon_prompt],
    )

    image_parts2 = [
        part.inline_data.data
        for part in response2.candidates[0].content.parts
        if getattr(part, "inline_data", None)
    ]

    if not image_parts2:
        raise Exception("⚠️ Gemini did not return any try-on image.")

    # Convert image to bytes directly
    output_image = Image.open(BytesIO(image_parts2[0]))
    buffer = BytesIO()
    output_image.save(buffer, format="PNG")
    tryon_bytes = buffer.getvalue()
    print("✅ Virtual try-on generated successfully.")
    return tryon_bytes

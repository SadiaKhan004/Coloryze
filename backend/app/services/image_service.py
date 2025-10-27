# import os
# import shutil
# from app.utils.file_utils import generate_unique_filename
# from app.ai.color_analyzer_cv import analyze_image

# UPLOAD_DIR = "uploads"
# os.makedirs(UPLOAD_DIR, exist_ok=True)


# async def save_uploaded_image(file):
#     """
#     Save uploaded image to disk, run AI model, and return result.
#     """
#     filename = generate_unique_filename(file.filename)
#     file_path = os.path.join(UPLOAD_DIR, filename)

#     # Save file
#     with open(file_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     # 🧠 Run AI analysis
#     analysis_result = analyze_image(file_path)

#     if not analysis_result:
#         return {
#             "status": "error",
#             "message": "No skin tone detected. Try another photo with clear lighting."
#         }

#     return {
#         "status": "success",
#         "message": "Image analyzed successfully.",
#         "filename": filename,
#         "result": analysis_result,
#     }
import os
from app.utils.file_utils import generate_unique_filename
from app.ai.color_analyzer_cv import analyze_image

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


async def save_uploaded_image(file):
    """
    Save uploaded image to disk, run AI model, and return result.
    """
    filename = generate_unique_filename(file.filename)
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Read uploaded file
    contents = await file.read()
    if not contents:
        return {"status": "error", "message": "Uploaded file is empty."}

    # Save to disk
    with open(file_path, "wb") as f:
        f.write(contents)

    print(f"Saved file: {file_path}, size: {len(contents)} bytes")

    # 🧠 Run AI analysis
    analysis_result = analyze_image(file_path)

    if not analysis_result:
        return {
            "status": "error",
            "message": "No skin tone detected. Try another photo with clear lighting."
        }

    return {
        "status": "success",
        "message": "Image analyzed successfully.",
        "filename": filename,
        "result": analysis_result,
    }

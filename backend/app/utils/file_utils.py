import uuid
import os

def generate_unique_filename(filename: str) -> str:
    """
    Generates a unique filename to prevent overwrites.
    """
    name, ext = os.path.splitext(filename)
    return f"{name}_{uuid.uuid4().hex[:8]}{ext}"

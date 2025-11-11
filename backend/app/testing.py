from supabase import create_client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

with open("test.png", "rb") as f:
    res = supabase.storage.from_("user_images").upload("test.png", f.read())
print(res)

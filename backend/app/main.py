# from fastapi import FastAPI
# from app.routes import upload  # import the routes module

# app = FastAPI(title="Coloryze Backend")

# # include the routes
# app.include_router(upload.router)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import image_routes
from app.routes import llm_routes
from app.middleware.logger import LoggingMiddleware

app = FastAPI(title="Coloryze Backend", version="1.0")

# --- Allow frontend (Vite React) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # change later to ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Custom Logging Middleware ---
app.add_middleware(LoggingMiddleware)

# --- Register Routes ---
app.include_router(image_routes.router, prefix="/api")
app.include_router(llm_routes.router, prefix="/api")  # NEW ROUTE


@app.get("/")
def root():
    return {"message": "Coloryze Backend is Running"}

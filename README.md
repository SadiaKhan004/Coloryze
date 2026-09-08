# Coloryze — AI-Powered Fashion Intelligence Platform

An agentic AI platform that analyzes your skin tone and recommends personalized colors and outfits.

## Features
- **Color Analysis** — Pre-trained Jonathan model + KMeans to identify skin tone and undertones
- **Palette & Report Generation** — SmolAgents-based agent searches fashion blogs and feeds content to an LLM to generate personalized color report
- **Garment Search** — Finds matching outfits from Pakistani brands using DDGS and KMeans color matching
- **Virtual Try-On** — Maps matched garments onto user photo using Gemini 2.5 Flash

## Installation
```bash
git clone https://github.com/[your-username]/coloryze.git
cd coloryze

# Set up virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env

# Run backend
uvicorn main:app --reload

# Run frontend (in a new terminal)
cd ../frontend
npm install
npm start
```

## Environment Variables

Create a `.env` file in the `backend/` folder with the following:

```env
GROQ_API_KEY=your_groq_api_key_here
HF_TOKEN=your_huggingface_token_here
DATABASE_URL=your_database_url_here

SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SECRET_KEY=your_secret_key_here
```

## Tech Stack
Python, FastAPI, React, SmolAgents, HuggingFace, OpenCV, KMeans, DDGS, Gemini API, Groq, PostgreSQL, Supabase

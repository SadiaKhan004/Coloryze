# Coloryze — AI-Powered Fashion Intelligence Platform

An agentic AI platform that analyzes your skin tone and recommends personalized colors and outfits.

## Features
- **Color Analysis** — Pre-trained Jonathan model + KMeans to identify skin tone and undertones
- **Palette & Report Generation** — SmolAgents-based agent searches fashion blogs and feeds content to an LLM to generate personalized color report
- **Garment Search** — Finds matching outfits from Pakistani brands using DDGS and KMeans color matching
- **Virtual Try-On** — Maps matched garments onto user photo using Gemini 2.5 Flash

## Tech Stack
Python, FastAPI, React, SmolAgents, HuggingFace, OpenCV, KMeans, DDGS, Gemini API, PostgreSQL, Supabase

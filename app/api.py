# app/api.py
import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.input_loader import load_csv, load_json, load_pdf

# Load .env
load_dotenv()
GEMINI_KEY = os.environ.get("GEMINI_API_KEY")
ELEVEN_KEY = os.environ.get("ELEVENLABS_API_KEY")
PORT = int(os.environ.get("PORT", 8000))
DEBUG_MODE = os.environ.get("DEBUG") == "True"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "model", "scam_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "model", "vectorizer.pkl")

try:
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    print("Model and vectorizer loaded successfully.")
except Exception as e:
    print("Error loading model/vectorizer:", e)
    model = 0
    vectorizer = 0

class CallTranscript(BaseModel):
    transcript: str

@app.get("/")
def root():
    return {"status": "API is running!"}

@app.post("/predict")
def predict(transcript_data: CallTranscript):
    
    text_vec = vectorizer.transform([transcript_data.transcript])
    pred = model.predict(text_vec)[0]
    confidence = max(model.predict_proba(text_vec)[0])

    THRESHOLD = 0.8
    is_scam = int(pred) if confidence >= THRESHOLD else 0

    keywords = ["lottery", "prize", "winner", "transfer money", "claim now"]
    if any(k in transcript_data.transcript.lower() for k in keywords):
        is_scam = 1

    message = "Scam detected!" if is_scam else "Probably safe."

    return {"scam_label": is_scam, "confidence": float(confidence), "message": message}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.api:app", host="0.0.0.0", port=PORT, reload=DEBUG_MODE)
# utils/input_loader.py
import pandas as pd
import json
from PyPDF2 import PdfReader

def load_csv(file_path):
    df = pd.read_csv(file_path)
    return df

def load_json(file_path):
    with open(file_path, "r") as f:
        data = json.load(f)
    return data

def load_pdf(file_path):
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text
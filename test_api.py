import requests

API_URL = "http://127.0.0.1:8000/predict"

test_transcripts = [
    "Congratulations! You won a lottery, send money now!",
    "Hello, I am calling about your recent purchase.",
    "Claim your prize by transferring money immediately!",
    "This is your friend calling to check on you."
]

for transcript in test_transcripts:
    response = requests.post(API_URL, json={"transcript": transcript})
    if response.status_code == 200:
        data = response.json()
        print(f"Transcript: {transcript}")
        print(f"API Response: {data}")
        print("-" * 50)
    else:
        print(f"Failed to get response for: {transcript}")
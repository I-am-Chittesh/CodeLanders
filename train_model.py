# train_model.py
import os
import joblib
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression

# Ensure model folder exists
os.makedirs("model", exist_ok=True)

# Example training data (fake scam vs normal transcripts)
X = [
    "Congratulations! You won a lottery, send money now!",
    "Claim your prize immediately!",
    "You are a lucky winner! Transfer money to claim.",
    "Hello, I am calling about your recent purchase.",
    "This is your friend calling to check on you.",
    "Meeting is scheduled at 3 PM today."
]
y = [1, 1, 1, 0, 0, 0]  # 1 = scam, 0 = safe

# Vectorize text
vectorizer = CountVectorizer()
X_vec = vectorizer.fit_transform(X)

# Train ML model
model = LogisticRegression()
model.fit(X_vec, y)

# Save model and vectorizer
joblib.dump(model, "model/scam_model.pkl")
joblib.dump(vectorizer, "model/vectorizer.pkl")

print("Training complete. scam_model.pkl and vectorizer.pkl saved in 'model/' folder.")
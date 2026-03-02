from faker import Faker
import pandas as pd
import random

fake = Faker()

def generate_call():
    is_scam = random.choice([0, 1])
    if is_scam:
        dialogue = f"{fake.name()} claims you won a lottery! Send money to {fake.iban()}."
    else:
        dialogue = f"{fake.name()} calls to confirm your appointment at {fake.company()}."
    return {"transcript": dialogue, "label": is_scam}

def create_dataset(n=1000):
    data = [generate_call() for _ in range(n)]
    df = pd.DataFrame(data)
    df.to_csv("data/synthetic_calls.csv", index=False)
    print("Synthetic CSV created at data/synthetic_calls.csv")

if __name__ == "__main__":
    create_dataset()
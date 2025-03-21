import os
import PyPDF2
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


input = "DoorDash subscription"

categories = ["Housing", "Utilities", "Groceries","Transportation", "Healthcare", "Dining Out", "Entertainment", "Shopping", "Travel", "Debt", "Payments", "Investments", "Education", "Subscriptions", "Personal Care", "Charity", "Childcare & Pets"] 


# Send a prompt to the cheapest model (GPT-3.5-Turbo)
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": f"What category should {input} be in? Categories : {categories} (Only choose from this list of categories)"}],
    max_tokens=50  # Reduce response length to save tokens
)

print(response.choices[0].message.content)
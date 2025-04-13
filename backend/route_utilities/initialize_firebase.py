# Env Imports
import os
from dotenv import load_dotenv, find_dotenv

# Firebase Imports
import firebase_admin
from firebase_admin import credentials
import pyrebase

# Load environment variables
load_dotenv(find_dotenv())

# Firebase Account credentials
firebase_creds = {
    "type": os.getenv("SERVER_ACCOUNT_GOOGLE_TYPE"),
    "project_id": os.getenv("SERVER_ACCOUNT_GOOGLE_PROJECT_ID"),
    "private_key_id": os.getenv("SERVER_ACCOUNT_GOOGLE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("SERVER_ACCOUNT_GOOGLE_PRIVATE_KEY").replace("\\n", "\n"),
    "client_email": os.getenv("SERVER_ACCOUNT_GOOGLE_CLIENT_EMAIL"),
    "client_id": os.getenv("SERVER_ACCOUNT_GOOGLE_CLIENT_ID"),
    "auth_uri": os.getenv("SERVER_ACCOUNT_GOOGLE_AUTH_URI"),
    "token_uri": os.getenv("SERVER_ACCOUNT_GOOGLE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("SERVER_ACCOUNT_GOOGLE_AUTH_PROVIDER_CERT_URL"),
    "client_x509_cert_url": os.getenv("SERVER_ACCOUNT_GOOGLE_CLIENT_CERT_URL"),
    "universe_domain": os.getenv("SERVER_ACCOUNT_GOOGLE_UNIVERSE_DOMAIN"),
}

# Initialize Firebase Admin SDK
def initialize_firebase():
    if not firebase_admin._apps:
        cred = credentials.Certificate(firebase_creds)
        firebase_admin.initialize_app(cred)

# Firebase Configuration for Pyrebase
firebaseConfig = {
    "apiKey": os.getenv("FIREBASE_API_KEY"),
    "authDomain": os.getenv("FIREBASE_AUTH_DOMAIN"),
    "projectId": os.getenv("FIREBASE_PROJECT_ID"),
    "storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId": os.getenv("FIREBASE_MESSAGING_SENDER_ID"),
    "appId": os.getenv("FIREBASE_APP_ID"),
    "measurementId": os.getenv("FIREBASE_MEASUREMENT_ID"),
    "databaseURL": os.getenv("FIREBASE_DATABASE_URL"),
}
# Initalize Pyrebase app
firebase = pyrebase.initialize_app(firebaseConfig)

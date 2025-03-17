from sqlalchemy import create_engine
import os
from dotenv import load_dotenv, find_dotenv

# Load environment variables
load_dotenv(find_dotenv())

def create_database_engine():
    try:
        engine = create_engine(
            f"postgresql+psycopg2://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PWD')}@{os.getenv('DB_HOSTNAME')}:{os.getenv('DB_PORT')}/{os.getenv('DB_DATABASE')}",
            echo=True
        )
        return engine
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

engine = create_database_engine()

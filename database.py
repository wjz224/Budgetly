import psycopg2
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

conn = psycopg2.connect(
    host = os.getenv("DB_HOSTNAME"),
    dbname = os.getenv("DB_DATABASE"),
    user = os.getenv("DB_USERNAME"),  
    password = os.getenv("DB_PWD"),
    port = os.getenv("DB_PORT")
)

conn.close()
# database.py
import os
from dotenv import load_dotenv, find_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from engine import engine

# Load Models:
from models.BaseFile import Base
from models.User import User
from models.Budget import Budget
from models.Transaction import Transaction
from models.Category import Category
from models.BudgetCategory import BudgetCategory

# Load environment variables
load_dotenv(find_dotenv())  

class Database:
    def __init__(self):
        self.engine = engine
        self.conn = self.engine.connect()
    def createTables(self):
        # Create all tables after the models are defined
        Base.metadata.create_all(bind=self.engine)
        print("Tables created successfully.")
    def dropTables(self):
        Base.metadata.drop_all(bind=self.engine)
        print("Tables dropped successfully.")

# Initialize Database
db = Database()

# Create tables
db.createTables()

# Close connection
db.conn.close()

# Library for connecting to our PostgreSQL database on AWS RDS
import os
from dotenv import load_dotenv, find_dotenv
from sqlalchemy import create_engine,Column,Integer,String,DateTime,ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

# Load environment variables
load_dotenv(find_dotenv())

class Database:
    def __init__(self):
        self.engine = self.__createEngine()
        self.conn = self.engine.connect()
        
    def __createEngine(self):
        try:
            engine = create_engine(f"postgresql+psycopg2://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PWD')}@{os.getenv('DB_HOSTNAME')}:{os.getenv('DB_PORT')}/{os.getenv('DB_DATABASE')}", echo = True)
        except Exception as e:
            print(f"Error connecting to database: {e}")
        finally:
            return engine
        

Base = declarative_base()

# User model
class User(Base):
    __tablename__ = "users"
    UserID = Column(Integer, primary_key=True, autoincrement=True)
    Email = Column(String, unique=True, nullable=False)
    CreatedAt = Column(DateTime, default=func.now())

    budgets = relationship("Budget", back_populates="user")

    
# Budget model
class Budget(Base):
    __tablename__ = "budgets"
    BudgetID = Column(Integer, primary_key=True, autoincrement=True)
    UserID = Column(Integer, ForeignKey('User.UserID'))
    Amount = Column(Integer, nullable=False)
    CreatedAt = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="budgets")
    transactions = relationship("Transaction", back_populates="budget")
    
    categories = relationship("Category", secondary="budgetcategories", back_populates="budgets")  

# Transaction model
class Transaction(Base):
    __tablename__ = "transactions"
    TransactionID = Column(Integer, primary_key=True, autoincrement=True)
    BudgetID = Column(Integer, ForeignKey('Budget.BudgetID'))
    Amount = Column(Integer, nullable=False)
    # Subject to change
    CreatedAt = Column(DateTime, default=func.now())

    budget = relationship("Budget", back_populates="transactions")


# Category model
class Category(Base):
    __tablename__ = "categories"
    CategoryID = Column(Integer, primary_key=True, autoincrement=True)
    Name = Column(String, unique=True, nullable=False)
    CreatedAt = Column(DateTime, default=func.now())
    
    budgets = relationship("Budget", secondary="budgetcategories", back_populates="categories")

# BudgetCategory Model

class BudgetCategory(Base):
    __tablename__ = "budgetcategories"
    BudgetID = Column(Integer, ForeignKey('Budget.BudgetID'))
    CategoryID = Column(Integer, ForeignKey('Category.CategoryID'))
    CreatedAt = Column(DateTime, default=func.now()) 
    

# # Report model
# class Report(Base):
#     __tablename__ = "reports"
#     ReportID = Column(Integer, primary_key=True, autoincrement=True)
#     UserID = Column(Integer, ForeignKey('User.UserID'))
#     Content = Column(String, nullable=False)
#     CreatedAt = Column(DateTime, default=func.now())

#     User = relationship("User")


# Initialize Databases

# Inserting Data

# Modifying Data

# Deleting Data



conn.close()
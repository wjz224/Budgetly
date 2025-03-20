from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.sql import func
from models.BaseFile import Base
from engine import engine

# Transaction model
class Transaction(Base):    
    __tablename__ = "transactions"
    TransactionID = Column(Integer, primary_key=True, autoincrement=True)
    BudgetID = Column(Integer, ForeignKey('budgets.BudgetID')) 
    Amount = Column(Integer, nullable=False)
    CreatedAt = Column(DateTime, default=func.now())
    CategoryID = Column(Integer, ForeignKey('categories.CategoryID'))

    category = relationship("Category", back_populates="transactions")
    budget = relationship("Budget", back_populates="transactions")

    @classmethod
    def insert_transaction(cls, budget_id, category_id, amount, created_at):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            new_transaction = cls(BudgetID=budget_id, CategoryID=category_id, Amount=amount, CreatedAt = created_at)
            session.add(new_transaction)
            session.commit()
            print(f"Transaction for budget {budget_id} with category {category_id} and amount {amount} and createdat {created_at} added successfully.")
        except Exception as e:
            session.rollback()
            print(f"Error inserting transaction: {e}")
        finally:
            session.close()

    @classmethod
    def get_transaction_by_id(cls, transaction_id):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            transaction = session.query(cls).get(transaction_id)
            return transaction
        finally:
            session.close()

    @classmethod
    def get_transactions_by_budget_id(cls, budget_id):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            transactions = session.query(cls).filter_by(BudgetID=budget_id).all()
            return transactions
        finally:
            session.close()

    @classmethod
    def update_transaction(cls, transaction_id, amount, category_id=None):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            transaction = session.query(cls).get(transaction_id)
            if transaction:
                transaction.Amount = amount
                if category_id is not None:
                    transaction.CategoryID = category_id
                session.commit()
                print(f"Transaction {transaction_id} updated successfully.")
            else:
                print(f"Transaction {transaction_id} not found.")
        except Exception as e:
            session.rollback()
            print(f"Error updating transaction: {e}")
        finally:
            session.close()

    @classmethod
    def delete_transaction(cls, transaction_id):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            transaction = session.query(cls).get(transaction_id)
            if transaction:
                session.delete(transaction)
                session.commit()
                print(f"Transaction {transaction_id} deleted successfully.")
            else:
                print(f"Transaction {transaction_id} not found.")
        except Exception as e:
            session.rollback()
            print(f"Error deleting transaction: {e}")
        finally:
            session.close()
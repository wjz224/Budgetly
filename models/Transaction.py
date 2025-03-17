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
    Amount = Column(Integer, nullable=False)(Integer, nullable=False)
    CreatedAt = Column(DateTime, default=func.now())

    budget = relationship("Budget", back_populates="transactions")

    @classmethod

    @classmethod
    def insert_transaction(cls, budget_id, amount):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            new_transaction = cls(BudgetID=budget_id, Amount=amount)
            session.add(new_transaction)
            session.commit()
            print(f"Transaction for budget {budget_id} with amount {amount} added successfully.")
        except Exception as e:
            session.rollback()
            print(f"Error inserting transaction: {e}")
        finally:
            session.close()
    def get_transaction_by_id(cls, transaction_id):
        from db_engine import engine  # Import engine inside the method to avoid circular import
        Session = sessionmaker(bind=engine)
        try:
            transaction = session.query(cls).get(transaction_id)
            return transaction
        finally:
            session.close()

        @classmethod
    def get_transactions_by_budget_id(cls, budget_id):
    from db_engine import engine  # Import engine inside the method to avoid circular import
        Session = sessionmaker(bind=engine)
        try:
            transactions = session.query(cls).filter_by(BudgetID=budget_id).all()
            return transactions
        finally:
            session.close()
    @classmethod
    def update_transaction(cls, transaction_id, amount):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            transaction = session.query(cls).get(transaction_id)
            if transaction:
                transaction.Amount = amount
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
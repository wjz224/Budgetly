from sqlalchemy import Column,String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.sql import func
from models.BaseFile import Base
from engine import engine

# Budget model
class Budget(Base):
    __tablename__ = "budgets"
    BudgetID = Column(Integer, primary_key=True, autoincrement=True)
    UserID = Column(Integer, ForeignKey('users.UserID'), nullable=False)
    BudgetName = Column(String, nullable=False)
    CreatedAt = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="budgets")
    transactions = relationship("Transaction", back_populates="budget")
    # Select Cateogires from Budget 
    categories = relationship("Category", secondary="budgetcategories", back_populates="budgets") 

    @classmethod
    def insert_budget(cls, user_id, name):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            new_budget = cls(UserID=user_id, BudgetName=name)
            session.add(new_budget)
            session.commit()
            print(f"Budget for user {user_id} with name '{name}' added successfully.")
        except Exception as e:
            session.rollback()
            print(f"Error inserting budget: {e}")
        finally:
            session.close()

    @classmethod
    def get_budget_by_id(cls, budget_id):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            budget = session.query(cls).get(budget_id)
            return budget
        finally:
            session.close()

    @classmethod
    def get_budgets_by_user_id(cls, user_id):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            budgets = session.query(cls).filter_by(UserID=user_id).all()
            return budgets
        finally:
            session.close()

    @classmethod
    def update_budget(cls, budget_id, name):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            budget = session.query(cls).get(budget_id)
            if budget:
                budget.BudgetName = name
                session.commit()
                print(f"Budget {budget_id} updated successfully with name '{name}'.")
            else:
                print(f"Budget {budget_id} not found.")
        except Exception as e:
            session.rollback()
            print(f"Error updating budget: {e}")
        finally:
            session.close()

    @classmethod
    def delete_budget(cls, budget_id):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            budget = session.query(cls).get(budget_id)
            if budget:
                session.delete(budget)
                session.commit()
                print(f"Budget {budget_id} deleted successfully.")
            else:
                print(f"Budget {budget_id} not found.")
        except Exception as e:
            session.rollback()
            print(f"Error deleting budget: {e}")
        finally:
            session.close()

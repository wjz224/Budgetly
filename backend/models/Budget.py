from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.sql import func
from models.BaseFile import Base
from engine import engine

# Budget model
class Budget(Base):
    __tablename__ = "budgets"
    BudgetID = Column(Integer, primary_key=True, autoincrement=True)
    UserID = Column(String, ForeignKey('users.UserID'), nullable=False)
    BudgetName = Column(String, nullable=False)
    BudgetStartDate = Column(DateTime, nullable=False)  # Start date of the budget
    BudgetEndDate = Column(DateTime, nullable=False)    # End date of the budget
    BudgetDescription = Column(String, nullable=False)  # Description of the budget
    Currency = Column(String, nullable=False)           # Currency for the budget
    CreatedAt = Column(DateTime, default=func.now())
    BudgetAmount = Column(Integer, nullable=False)      # Budget amount

    user = relationship("User", back_populates="budgets")
    transactions = relationship("Transaction", back_populates="budget")
    categories = relationship("Category", secondary="budgetcategories", back_populates="budgets")

    @classmethod
    def insert_budget(cls, user_id, name, amount, start_date, end_date, description, currency):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            new_budget = cls(
                UserID=user_id,
                BudgetName=name,
                BudgetAmount=amount,
                BudgetStartDate=start_date,
                BudgetEndDate=end_date,
                BudgetDescription=description,
                Currency=currency
            )
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
    def update_budget(cls, budget_id, name, amount, start_date, end_date, description, currency):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            budget = session.query(cls).get(budget_id)
            if budget:
                budget.BudgetName = name
                budget.BudgetAmount = amount
                budget.BudgetStartDate = start_date
                budget.BudgetEndDate = end_date
                budget.BudgetDescription = description
                budget.Currency = currency
                session.commit()
                print(f"Budget {budget_id} updated successfully.")
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

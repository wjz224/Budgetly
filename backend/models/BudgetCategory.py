from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.sql import func
from models.BaseFile import Base
from engine import engine

# BudgetCategory Model
class BudgetCategory(Base):
    __tablename__ = "budgetcategories"
    BudgetID = Column(Integer, ForeignKey('budgets.BudgetID'), primary_key=True)
    CategoryID = Column(Integer, ForeignKey('categories.CategoryID'), primary_key=True)
    CreatedAt = Column(DateTime, default=func.now())

    @classmethod
    def insert_budget_category(cls, budget_id, category_id):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            new_budget_category = cls(BudgetID=budget_id, CategoryID=category_id)
            session.add(new_budget_category)
            session.commit()
            print(f"BudgetCategory with BudgetID {budget_id} and CategoryID {category_id} added successfully.")
        except Exception as e:
            session.rollback()
            print(f"Error inserting BudgetCategory: {e}")
        finally:
            session.close()

    @classmethod
    def update_budget_category(cls, budget_id, category_id, new_budget_id, new_category_id):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            budget_category = session.query(cls).filter_by(BudgetID=budget_id, CategoryID=category_id).first()
            if budget_category:
                budget_category.BudgetID = new_budget_id
                budget_category.CategoryID = new_category_id
                session.commit()
                print(f"BudgetCategory with BudgetID {budget_id} and CategoryID {category_id} updated successfully.")
            else:
                print(f"BudgetCategory with BudgetID {budget_id} and CategoryID {category_id} not found.")
        except Exception as e:
            session.rollback()
            print(f"Error updating BudgetCategory: {e}")
        finally:
            session.close()

    @classmethod
    def delete_budget_category(cls, budget_id, category_id):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            budget_category = session.query(cls).filter_by(BudgetID=budget_id, CategoryID=category_id).first()
            if budget_category:
                session.delete(budget_category)
                session.commit()
                print(f"BudgetCategory with BudgetID {budget_id} and CategoryID {category_id} deleted successfully.")
            else:
                print(f"BudgetCategory with BudgetID {budget_id} and CategoryID {category_id} not found.")
        except Exception as e:
            session.rollback()
            print(f"Error deleting BudgetCategory: {e}")
        finally:
            session.close()

    @classmethod
    def get_budget_category(cls, budget_id, category_id):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            budget_category = session.query(cls).filter_by(BudgetID=budget_id, CategoryID=category_id).first()
            return budget_category
        except Exception as e:
            print(f"Error retrieving BudgetCategory: {e}")
        finally:
            session.close()
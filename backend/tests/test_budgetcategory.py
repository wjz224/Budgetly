import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import unittest
from sqlalchemy.orm import sessionmaker
from database import Database
from models.BudgetCategory import BudgetCategory
from models.Budget import Budget
from models.Category import Category
from models.User import User
from models.BaseFile import Base

class TestBudgetCategory(unittest.TestCase):
    def setUp(self):
        """Set up the test database and session."""
        try:
            self.db = Database()
            self.engine = self.db.engine
            self.Session = sessionmaker(bind=self.engine)
            self.session = self.Session()
            Base.metadata.create_all(bind=self.engine)  # Create tables for testing

            # Insert a test user into the database
            User.insert_user("1", "testuser@example.com")
            self.test_user = self.session.query(User).filter_by(Email="testuser@example.com").first()

            # Insert a test budget for the user
            Budget.insert_budget(self.test_user.UserID, "test_budget", 500)  # Add BudgetAmount
            self.test_budget = self.session.query(Budget).filter_by(UserID=self.test_user.UserID).first()

            # Insert a test category
            Category.insert_category("Food")
            self.test_category = self.session.query(Category).filter_by(Name="Food").first()
        except Exception as e:
            print(f"Error in setUp: {e}")
            self.tearDown()
            raise

    def tearDown(self):
        """Tear down the test database."""
        try:
            self.session.rollback()
            self.session.close()
            self.db.dropTables()
            self.db.conn.close()
        except Exception as e:
            print(f"Error in tearDown: {e}")

    def test_insert_budget_category(self):
        """Test inserting a budget-category relationship."""
        try:
            BudgetCategory.insert_budget_category(budget_id=self.test_budget.BudgetID, category_id=self.test_category.CategoryID)
            budget_category = self.session.query(BudgetCategory).filter_by(BudgetID=self.test_budget.BudgetID, CategoryID=self.test_category.CategoryID).first()
            self.assertIsNotNone(budget_category)
            self.assertEqual(budget_category.BudgetID, self.test_budget.BudgetID)
            self.assertEqual(budget_category.CategoryID, self.test_category.CategoryID)
        except Exception as e:
            print(f"Error in test_insert_budget_category: {e}")
            raise

    def test_update_budget_category(self):
        """Test updating a budget-category relationship."""
        try:
            BudgetCategory.insert_budget_category(budget_id=self.test_budget.BudgetID, category_id=self.test_category.CategoryID)

            # Insert a new category for the update
            Category.insert_category("Utilities")
            new_category = self.session.query(Category).filter_by(Name="Utilities").first()

            # Update the budget-category relationship
            BudgetCategory.update_budget_category(
                budget_id=self.test_budget.BudgetID,
                category_id=self.test_category.CategoryID,
                new_budget_id=self.test_budget.BudgetID,
                new_category_id=new_category.CategoryID
            )
            self.session.commit()

            updated_budget_category = self.session.query(BudgetCategory).filter_by(BudgetID=self.test_budget.BudgetID, CategoryID=new_category.CategoryID).first()
            self.assertIsNotNone(updated_budget_category)
            self.assertEqual(updated_budget_category.BudgetID, self.test_budget.BudgetID)
            self.assertEqual(updated_budget_category.CategoryID, new_category.CategoryID)
        except Exception as e:
            print(f"Error in test_update_budget_category: {e}")
            raise

    def test_delete_budget_category(self):
        """Test deleting a budget-category relationship."""
        try:
            BudgetCategory.insert_budget_category(budget_id=self.test_budget.BudgetID, category_id=self.test_category.CategoryID)
            BudgetCategory.delete_budget_category(budget_id=self.test_budget.BudgetID, category_id=self.test_category.CategoryID)
            deleted_budget_category = self.session.query(BudgetCategory).filter_by(BudgetID=self.test_budget.BudgetID, CategoryID=self.test_category.CategoryID).first()
            self.assertIsNone(deleted_budget_category)
        except Exception as e:
            print(f"Error in test_delete_budget_category: {e}")
            raise

    def test_get_budget_category(self):
        """Test retrieving a budget-category relationship."""
        try:
            BudgetCategory.insert_budget_category(budget_id=self.test_budget.BudgetID, category_id=self.test_category.CategoryID)
            budget_category = BudgetCategory.get_budget_category(budget_id=self.test_budget.BudgetID, category_id=self.test_category.CategoryID)
            self.assertIsNotNone(budget_category)
            self.assertEqual(budget_category.BudgetID, self.test_budget.BudgetID)
            self.assertEqual(budget_category.CategoryID, self.test_category.CategoryID)
        except Exception as e:
            print(f"Error in test_get_budget_category: {e}")
            raise

if __name__ == "__main__":
    unittest.main()
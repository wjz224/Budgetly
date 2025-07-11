import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import unittest
from sqlalchemy.orm import sessionmaker
from database import Database
from models.User import User
from models.Budget import Budget

class TestBudget(unittest.TestCase):
    def setUp(self):
        """Set up the test database and session."""
        self.db = Database()
        self.db.createTables()
        Session = sessionmaker(bind=self.db.engine)
        self.session = Session()

        # Insert a test user into the database using insert_user method
        User.insert_user("1", "testuser@example.com")
        self.test_user = self.session.query(User).filter_by(Email="testuser@example.com").first()

    def tearDown(self):
        """Tear down the test database."""
        self.session.rollback()
        self.session.close()
        self.db.dropTables()
        self.db.conn.close()

    def test_create_budget(self):
        """Test creating a budget."""
        Budget.insert_budget(self.test_user.UserID, "Monthly Expenses", 1000)  # Add BudgetAmount
        retrieved_budget = self.session.query(Budget).filter_by(UserID=self.test_user.UserID).first()
        self.assertIsNotNone(retrieved_budget)
        self.assertEqual(retrieved_budget.BudgetName, "Monthly Expenses")
        self.assertEqual(retrieved_budget.BudgetAmount, 1000)  # Assert BudgetAmount

    def test_update_budget(self):
        """Test updating a budget."""
        Budget.insert_budget(self.test_user.UserID, "Monthly Expenses", 1000)  # Add BudgetAmount
        budget = self.session.query(Budget).filter_by(UserID=self.test_user.UserID).first()
        Budget.update_budget(budget.BudgetID, "Yearly Expenses", 12000)  # Update BudgetAmount
        self.session.commit()

        updated_budget = self.session.query(Budget).filter_by(UserID=self.test_user.UserID).first()
        self.assertIsNotNone(updated_budget)
        self.assertEqual(updated_budget.BudgetName, "Yearly Expenses")
        self.assertEqual(updated_budget.BudgetAmount, 12000)  # Assert updated BudgetAmount

    def test_delete_budget(self):
        """Test deleting a budget."""
        Budget.insert_budget(self.test_user.UserID, "Monthly Expenses", 1000)  # Add BudgetAmount
        budget = self.session.query(Budget).filter_by(UserID=self.test_user.UserID).first()
        Budget.delete_budget(budget.BudgetID)

        deleted_budget = self.session.query(Budget).filter_by(BudgetID=budget.BudgetID).first()
        self.assertIsNone(deleted_budget)

if __name__ == "__main__":
    unittest.main()
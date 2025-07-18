import sys
import os
from datetime import datetime, timedelta

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

        # Common test data for budgets
        self.start_date = datetime.now()
        self.end_date = self.start_date + timedelta(days=30)
        self.description = "Test budget description"
        self.amount = 1000
        self.currency = "USD"

    def tearDown(self):
        """Tear down the test database."""
        self.session.rollback()
        self.session.close()
        self.db.dropTables()
        self.db.conn.close()

    def test_create_budget(self):
        """Test creating a budget."""
        Budget.insert_budget(
            self.test_user.UserID,
            "Monthly Expenses",
            self.amount,
            self.start_date,
            self.end_date,
            self.description,
            self.currency
        )
        retrieved_budget = self.session.query(Budget).filter_by(UserID=self.test_user.UserID).first()
        self.assertIsNotNone(retrieved_budget)
        self.assertEqual(retrieved_budget.BudgetName, "Monthly Expenses")
        self.assertEqual(retrieved_budget.BudgetAmount, self.amount)
        self.assertEqual(retrieved_budget.BudgetStartDate, self.start_date)
        self.assertEqual(retrieved_budget.BudgetEndDate, self.end_date)
        self.assertEqual(retrieved_budget.BudgetDescription, self.description)
        self.assertEqual(retrieved_budget.Currency, self.currency)

    def test_update_budget(self):
        """Test updating a budget."""
        Budget.insert_budget(
            self.test_user.UserID,
            "Monthly Expenses",
            self.amount,
            self.start_date,
            self.end_date,
            self.description,
            self.currency
        )
        budget = self.session.query(Budget).filter_by(UserID=self.test_user.UserID).first()
        new_name = "Yearly Expenses"
        new_amount = 12000
        new_start = self.start_date + timedelta(days=1)
        new_end = self.end_date + timedelta(days=1)
        new_description = "Updated description"
        new_currency = "EUR"
        Budget.update_budget(
            budget.BudgetID,
            new_name,
            new_amount,
            new_start,
            new_end,
            new_description,
            new_currency
        )
        self.session.commit()

        updated_budget = self.session.query(Budget).filter_by(UserID=self.test_user.UserID).first()
        self.assertIsNotNone(updated_budget)
        self.assertEqual(updated_budget.BudgetName, new_name)
        self.assertEqual(updated_budget.BudgetAmount, new_amount)
        self.assertEqual(updated_budget.BudgetStartDate, new_start)
        self.assertEqual(updated_budget.BudgetEndDate, new_end)
        self.assertEqual(updated_budget.BudgetDescription, new_description)
        self.assertEqual(updated_budget.Currency, new_currency)

    def test_delete_budget(self):
        """Test deleting a budget."""
        Budget.insert_budget(
            self.test_user.UserID,
            "Monthly Expenses",
            self.amount,
            self.start_date,
            self.end_date,
            self.description,
            self.currency
        )
        budget = self.session.query(Budget).filter_by(UserID=self.test_user.UserID).first()
        Budget.delete_budget(budget.BudgetID)

        deleted_budget = self.session.query(Budget).filter_by(BudgetID=budget.BudgetID).first()
        self.assertIsNone(deleted_budget)

if __name__ == "__main__":
    unittest.main()
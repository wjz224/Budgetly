import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import unittest
from datetime import datetime
from sqlalchemy.orm import sessionmaker
from database import Database
from models.Category import Category
from models.Budget import Budget
from models.User import User
from models.Transaction import Transaction
from models.BaseFile import Base

class TestTransaction(unittest.TestCase):
    def setUp(self):
        """Set up the test database and session."""
        print("Setting up the database...")
        self.db = Database()
        self.db.createTables()
        print("Tables created.")
        Session = sessionmaker(bind=self.db.engine)
        self.session = Session()

        # Insert a test user, budget, and category into the database
        print("Inserting test data...")
        User.insert_user("1","testuser@example.com")
        self.test_user = self.session.query(User).filter_by(Email="testuser@example.com").first()

        Budget.insert_budget(self.test_user.UserID, "Test Budget")
        self.test_budget = self.session.query(Budget).filter_by(UserID=self.test_user.UserID).first()

        Category.insert_category("Test Category")
        self.test_category = self.session.query(Category).filter_by(Name="Test Category").first()
        print("Test data inserted.")

    def tearDown(self):
        """Tear down the test database."""
        print("Rolling back session...")
        self.session.rollback()
        print("Closing session...")
        self.session.close()
        print("Dropping tables...")
        self.db.dropTables()
        print("Tables dropped.")
        print("Closing database connection...")
        self.db.conn.close()
        print("Database connection closed.")

    def test_create_transaction(self):
        """Test creating a transaction."""
        created_at = datetime.now()
        Transaction.insert_transaction(self.test_budget.BudgetID, self.test_category.CategoryID, 100, created_at)
        retrieved_transaction = self.session.query(Transaction).filter_by(BudgetID=self.test_budget.BudgetID, CategoryID=self.test_category.CategoryID).first()
        self.assertIsNotNone(retrieved_transaction)
        self.assertEqual(retrieved_transaction.Amount, 100)
        self.assertEqual(retrieved_transaction.CreatedAt, created_at)

    def test_update_transaction(self):
        """Test updating a transaction."""
        created_at = datetime.now()
        Transaction.insert_transaction(self.test_budget.BudgetID, self.test_category.CategoryID, 100, created_at)
        transaction = self.session.query(Transaction).filter_by(BudgetID=self.test_budget.BudgetID, CategoryID=self.test_category.CategoryID).first()
        Transaction.update_transaction(transaction.TransactionID, 200)
        self.session.commit()

        updated_transaction = self.session.query(Transaction).filter_by(TransactionID=transaction.TransactionID).first()
        self.assertIsNotNone(updated_transaction)
        self.assertEqual(updated_transaction.Amount, 200)

    def test_delete_transaction(self):
        """Test deleting a transaction."""
        created_at = datetime.now()
        Transaction.insert_transaction(self.test_budget.BudgetID, self.test_category.CategoryID, 100, created_at)
        transaction = self.session.query(Transaction).filter_by(BudgetID=self.test_budget.BudgetID, CategoryID=self.test_category.CategoryID).first()
        Transaction.delete_transaction(transaction.TransactionID)
        deleted_transaction = self.session.query(Transaction).filter_by(TransactionID=transaction.TransactionID).first()
        self.assertIsNone(deleted_transaction)

    def test_update_category(self):
        """Test updating a category."""
        Category.update_category(self.test_category.CategoryID, "Updated Category")
        self.session.commit()  
        
        updated_category = self.session.query(Category).filter_by(CategoryID=self.test_category.CategoryID).first()
        self.assertIsNotNone(updated_category)
        self.assertEqual(updated_category.Name, "Updated Category")


if __name__ == "__main__":
    unittest.main()
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import unittest
from sqlalchemy.orm import sessionmaker
from database import Database
from models.Category import Category
from models.User import User
from models.Budget import Budget
from datetime import datetime, timedelta

class TestCategory(unittest.TestCase):
    def setUp(self):
        """Set up the test database and session."""
        self.db = Database()
        self.db.createTables()
        Session = sessionmaker(bind=self.db.engine)
        self.session = Session()

        # Insert a test user and budget for category relationships if needed
        User.insert_user("1", "testuser@example.com")
        self.test_user = self.session.query(User).filter_by(Email="testuser@example.com").first()
        self.start_date = datetime.now()
        self.end_date = self.start_date + timedelta(days=30)
        self.description = "Test budget description"
        self.amount = 1000
        self.currency = "USD"
        Budget.insert_budget(
            self.test_user.UserID,
            "Test Budget",
            self.amount,
            self.start_date,
            self.end_date,
            self.description,
            self.currency
        )
        self.test_budget = self.session.query(Budget).filter_by(UserID=self.test_user.UserID).first()

    def tearDown(self):
        """Tear down the test database."""
        self.session.rollback()
        self.session.close()
        self.db.dropTables()
        self.db.conn.close()

    def test_insert_category(self):
        """Test inserting a category using the insert_category method."""
        Category.insert_category("Food")
        category = self.session.query(Category).filter_by(Name="Food").first()
        self.assertIsNotNone(category)
        self.assertEqual(category.Name, "Food")

    def test_update_category(self):
        """Test updating a category using the update_category method."""
        # Insert a category first
        Category.insert_category("Food")
        category = self.session.query(Category).filter_by(Name="Food").first()
        # Update the category name
        Category.update_category(category.CategoryID, "Groceries")
        self.session.commit()
        updated_category = self.session.query(Category).filter_by(CategoryID=category.CategoryID).first()
        self.assertIsNotNone(updated_category)
        self.assertEqual(updated_category.Name, "Groceries")

    def test_delete_category(self):
        """Test deleting a category using the delete_category method."""
        # Insert a category first
        Category.insert_category("Food")
        category = self.session.query(Category).filter_by(Name="Food").first()

        # Delete the category
        Category.delete_category(category.CategoryID)
        deleted_category = self.session.query(Category).filter_by(CategoryID=category.CategoryID).first()
        self.assertIsNone(deleted_category)

    def test_get_category(self):
        """Test retrieving a category by ID using the get_category method."""
        # Insert a category first
        Category.insert_category("Food")
        category = self.session.query(Category).filter_by(Name="Food").first()

        # Retrieve the category by ID
        retrieved_category = Category.get_category(category.CategoryID)
        self.assertIsNotNone(retrieved_category)
        self.assertEqual(retrieved_category.Name, "Food")

    def test_get_category_by_name(self):
        """Test retrieving a category by name using the get_category_by_name method."""
        # Insert a category first
        Category.insert_category("Food")

        # Retrieve the category by name
        retrieved_category = Category.get_category_by_name("Food")
        self.assertIsNotNone(retrieved_category)
        self.assertEqual(retrieved_category.Name, "Food")

if __name__ == "__main__":
    unittest.main()
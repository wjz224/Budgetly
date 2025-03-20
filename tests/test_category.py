import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import unittest
from sqlalchemy.orm import sessionmaker
from database import Database
from models.Category import Category

class TestCategory(unittest.TestCase):
    def setUp(self):
        """Set up the test database and session."""
        self.db = Database()
        self.db.createTables()
        Session = sessionmaker(bind=self.db.engine)
        self.session = Session()

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
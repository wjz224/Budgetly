import sys
import unittest
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from database import Database
from models.BaseFile import Base
from sqlalchemy import inspect

class test_database(unittest.TestCase):
    def setUp(self):
        # Initialize the Database
        self.db = Database()
    
    def tearDown(self):
        # Close the connection after each test
        self.db.conn.close()

    def test_createTables(self):
        # Test the createTables method
        self.db.createTables()
        # Check if the tables are created
        inspector = inspect(self.db.engine)
        tables = inspector.get_table_names()
        self.assertIn('users', tables)
        self.assertIn('budgets', tables)
        self.assertIn('transactions', tables)
        self.assertIn('categories', tables)
        self.assertIn('budgetcategories', tables)

    def test_dropTables(self):
        # Test the dropTables method
        self.db.dropTables()
        # Check if the tables are dropped
        inspector = inspect(self.db.engine)
        tables = inspector.get_table_names()
        self.assertNotIn('users', tables)
        self.assertNotIn('budgets', tables)
        self.assertNotIn('transactions', tables)
        self.assertNotIn('categories', tables)
        self.assertNotIn('budgetcategories', tables)

if __name__ == '__main__':
    unittest.main()
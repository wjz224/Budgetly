import unittest
import os
import sys

# Add the project directory to the system path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Import all test modules
from tests.test_user import TestUser
from tests.test_budget import TestBudget
from tests.test_category import TestCategory
from tests.test_transaction import TestTransaction
from tests.test_budgetcategory import TestBudgetCategory
from tests.test_database import test_database

if __name__ == "__main__":
    # Create a test suite combining all test cases
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(TestUser))
    suite.addTest(unittest.makeSuite(TestBudget))
    suite.addTest(unittest.makeSuite(TestCategory))
    suite.addTest(unittest.makeSuite(TestTransaction))
    suite.addTest(unittest.makeSuite(TestBudgetCategory))
    suite.addTest(unittest.makeSuite(test_database))

    # Run the test suite
    runner = unittest.TextTestRunner()
    runner.run(suite)
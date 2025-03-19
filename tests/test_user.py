import unittest
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from sqlalchemy.orm import sessionmaker
from database import Database
from models.User import User

class TestUser(unittest.TestCase):
    def setUp(self):
        self.db = Database()
        self.db.createTables()
        Session = sessionmaker(bind=self.db.engine)
        self.session = Session()
    
    def tearDown(self):
        # Rollback any changes made during the test
        self.session.rollback()
        self.session.close()
        self.db.dropTables()
        self.db.conn.close()

    def test_create_user(self):
        # Test creating a new user
        new_user = User(UserID=8, Email='testuser@example.com')
        self.session.add(new_user)
        self.session.commit()
        # Query the user
        user = self.session.query(User).filter_by(UserID=8).first()
        self.assertIsNotNone(user)
        self.assertEqual(user.Email, 'testuser@example.com')

    def test_delete_user(self):
        # Test deleting a user
        new_user = User(UserID=8, Email='testuser@example.com')
        self.session.add(new_user)
        self.session.commit()
        # Delete the user
        self.session.delete(new_user)
        self.session.commit()
        # Query the user
        user = self.session.query(User).filter_by(UserID=8).first()
        self.assertIsNone(user)

if __name__ == '__main__':
    unittest.main()
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.sql import func
from models.BaseFile import Base
from engine import engine

# User model
class User(Base):
    __tablename__ = "users"
    UserID = Column(String, primary_key=True)
    Email = Column(String, unique=True, nullable=False)
    CreatedAt = Column(DateTime, default=func.now())

    budgets = relationship("Budget", back_populates="user")
    

    @classmethod
    def insert_user(cls, userID, email):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            # Check if the user with email already exists
            print("inserting user...")
            existing_user = session.query(cls).filter_by(Email=email).first()
            if existing_user:
                raise Exception(f"User with email {email} already exists.")

            # Check if the user id already exists
            existing_user = session.query(cls).filter_by(UserID= userID).first()
            if existing_user:
                raise Exception(f"User with email {userID} already exists.")
       
            new_user = cls(UserID = userID, Email=email)
            session.add(new_user)
            session.commit()
            print(f"UserID: {userID} Email: {email} added successfully.")    
        except Exception as e:
            session.rollback()
            print(f"Error inserting user: {e}")
        finally:
            session.close()

    @classmethod
    def get_user_by_id(cls, user_id):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            user = session.query(cls).get(user_id)
            return user
        finally:
            session.close()

    @classmethod
    def get_user_by_email(cls, email):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            user = session.query(cls).filter_by(Email=email).first()
            return user
        finally:
            session.close()

    @classmethod
    def update_user(cls, user_id, email):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            user = session.query(cls).get(user_id)
            if user:
                user.Email = email
                session.commit()
                print(f"User {user_id} updated successfully.")
            else:
                print(f"User {user_id} not found.")
        except Exception as e:
            session.rollback()
            print(f"Error updating user: {e}")
        finally:
            session.close()

    @classmethod
    def delete_user(cls, user_id):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            user = session.query(cls).get(user_id)
            if user:
                session.delete(user)
                session.commit()
                print(f"User {user_id} deleted successfully.")
            else:
                print(f"User {user_id} not found.")
        except Exception as e:
            session.rollback()
            print(f"Error deleting user: {e}")
        finally:
            session.close()
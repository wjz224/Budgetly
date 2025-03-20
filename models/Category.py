from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.sql import func
from models.BaseFile import Base
from engine import engine

# Category model
class Category(Base):
    __tablename__ = "categories"
    CategoryID = Column(Integer, primary_key=True, autoincrement=True)
    Name = Column(String, unique=True, nullable=False)
    CreatedAt = Column(DateTime, default=func.now())
    
    transactions = relationship("Transaction", back_populates="category")
    budgets = relationship("Budget", secondary="budgetcategories", back_populates="categories")

    @classmethod
    def insert_category(cls, name):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            new_category = cls(Name=name)
            session.add(new_category)
            session.commit()
            print(f"Category '{name}' added successfully.")
        except Exception as e:
            session.rollback()
            print(f"Error inserting category: {e}")
        finally:
            session.close()

    @classmethod
    def update_category(cls, category_id, name):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            category = session.query(cls).get(category_id)
            if category:
                category.Name = name
                session.commit()
                print(f"Category {category_id} updated successfully.")
            else:
                print(f"Category {category_id} not found.")
        except Exception as e:
            session.rollback()
            print(f"Error updating category: {e}")
        finally:
            session.close()

    @classmethod
    def delete_category(cls, category_id):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            category = session.query(cls).get(category_id)
            if category:
                session.delete(category)
                session.commit()
                print(f"Category {category_id} deleted successfully.")
            else:
                print(f"Category {category_id} not found.")
        except Exception as e:
            session.rollback()
            print(f"Error deleting category: {e}")
        finally:
            session.close()

    @classmethod
    def get_category(cls, category_id):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            category = session.query(cls).get(category_id)
            return category
        except Exception as e:
            print(f"Error retrieving category: {e}")
        finally:
            session.close()

    @classmethod
    def get_category_by_name(cls, name):
        Session = sessionmaker(bind=engine)
        session = Session()
        try:
            category = session.query(cls).filter_by(Name=name).first()
            return category
        except Exception as e:
            print(f"Error retrieving category by name: {e}")
        finally:
            session.close()


# Report model
class Report(Base):
    __tablename__ = "reports"
    ReportID = Column(Integer, primary_key=True, autoincrement=True)
    UserID = Column(Integer, ForeignKey('User.UserID'))
    Content = Column(String, nullable=False)
    CreatedAt = Column(DateTime, default=func.now())
    User = relationship("User")

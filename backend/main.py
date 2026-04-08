from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from database import engine, SessionLocal
from models import Base, User

app = FastAPI()
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Schema
class UserSchema(BaseModel):
    name: str
    email: EmailStr
    phone: str
    dob: str

@app.get("/")
def home():
    return {"message": "API is running"}

@app.post("/register")
def register_user(user: UserSchema, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        return {"error": "Email already exists"}
    new_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        dob=user.dob
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User saved to database"}
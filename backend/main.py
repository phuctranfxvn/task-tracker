from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime, timedelta
from sqlalchemy import create_engine, Column, Integer, String, Boolean, Date, ForeignKey, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import sessionmaker, Session, relationship, declarative_base
from passlib.context import CryptContext
from jose import JWTError, jwt
import configparser
import click
import uuid

# Đọc cấu hình
config = configparser.ConfigParser()
config.read(r'config.conf')

# --- CẤU HÌNH BẢO MẬT ---
SECRET_KEY = config.get('TASKTRACKER', 'SECRET_KEY')
ALGORITHM = config.get('TASKTRACKER', 'ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = config.get('TASKTRACKER', 'ACCESS_TOKEN_EXPIRE_MINUTES')
ACCESS_TOKEN_EXPIRE_MINUTES = int(ACCESS_TOKEN_EXPIRE_MINUTES)

# --- CẤU HÌNH DATABASE ---
DB_HOST = config.get('TASKTRACKER', 'DB_HOST')
DB_PORT = config.get('TASKTRACKER', 'DB_PORT')
DB_NAME = config.get('TASKTRACKER', 'DB_NAME')
DB_USER = config.get('TASKTRACKER', 'DB_USER')
DB_PASS = config.get('TASKTRACKER', 'DB_PASS')

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

FRONTEND_URL = config.get('TASKTRACKER', 'FRONTEND_URL')

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- PASSWORD HASHING ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- MODELS (DB Tables) ---
class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)

class CategoryDB(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

class OwnerDB(Base):
    __tablename__ = "owners"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

class SecurityCodeDB(Base):
    __tablename__ = "security_codes"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    is_used = Column(Boolean, default=False)
    used_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by_user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    used_by = relationship("UserDB", foreign_keys=[used_by_user_id])
    created_by = relationship("UserDB", foreign_keys=[created_by_user_id])

class BirthdayDB(Base):
    __tablename__ = "birthdays"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    day = Column(Integer)
    month = Column(Integer)
    user_id = Column(Integer, ForeignKey("users.id"))

class TaskDB(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    owner_id = Column(Integer, ForeignKey("owners.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    priority = Column(String)
    status = Column(String)
    due_date = Column(Date, nullable=True)
    is_important = Column(Boolean, default=False)
    is_urgent = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    category = relationship("CategoryDB")
    owner = relationship("OwnerDB")
    user = relationship("UserDB", foreign_keys=[user_id])

Base.metadata.create_all(bind=engine)

# --- SCHEMAS ---
class UserCreate(BaseModel):
    username: str
    password: str
    security_code: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    is_admin: bool

class TaskCreate(BaseModel):
    description: str
    category_name: str
    owner_name: str
    priority: str
    status: str
    due_date: Optional[date] = None
    is_important: bool
    is_urgent: bool
    notes: Optional[str] = None

class TaskResponse(TaskCreate):
    id: int
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class ConfigItem(BaseModel):
    name: str

class SecurityCodeCreate(BaseModel):
    code: str

class SecurityCodeResponse(BaseModel):
    code: str
    is_used: bool
    used_by_username: Optional[str] = None

class SystemStatus(BaseModel):
    has_users: bool

class BirthdayCreate(BaseModel):
    name: str
    day: int
    month: int

class BirthdayResponse(BirthdayCreate):
    id: int
    class Config:
        from_attributes = True

# --- AUTH HELPERS ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- APP ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(UserDB).filter(UserDB.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# --- HELPERS ---
def get_or_create_category(db: Session, name: str, user_id: int):
    if not name: return None
    cat = db.query(CategoryDB).filter(CategoryDB.name == name, CategoryDB.user_id == user_id).first()
    if not cat:
        cat = CategoryDB(name=name, user_id=user_id)
        db.add(cat)
        db.commit()
        db.refresh(cat)
    return cat

def get_or_create_owner(db: Session, name: str, user_id: int):
    if not name: return None
    own = db.query(OwnerDB).filter(OwnerDB.name == name, OwnerDB.user_id == user_id).first()
    if not own:
        own = OwnerDB(name=name, user_id=user_id)
        db.add(own)
        db.commit()
        db.refresh(own)
    return own

# --- API ENDPOINTS ---

# 0. SYSTEM STATUS Check
@app.get("/system/status", response_model=SystemStatus)
def check_system_status(db: Session = Depends(get_db)):
    user_count = db.query(UserDB).count()
    return {"has_users": user_count > 0}

# 1. AUTHENTICATION
@app.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    user_count = db.query(UserDB).count()
    is_first_user = user_count == 0
    
    security_code_record = None

    if not is_first_user:
        if not user.security_code:
            raise HTTPException(status_code=400, detail="Security code required")
        
        security_code_record = db.query(SecurityCodeDB).filter(SecurityCodeDB.code == user.security_code).first()
        if not security_code_record:
            raise HTTPException(status_code=400, detail="Invalid security code")
        if security_code_record.is_used:
            raise HTTPException(status_code=400, detail="Security code already used")

    hashed_password = get_password_hash(user.password)
    new_user = UserDB(
        username=user.username, 
        hashed_password=hashed_password,
        is_admin=is_first_user 
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    if security_code_record:
        security_code_record.is_used = True
        security_code_record.used_by_user_id = new_user.id
        db.commit()
    
    access_token = create_access_token(data={"sub": new_user.username})
    return {"access_token": access_token, "token_type": "bearer", "is_admin": new_user.is_admin}

@app.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "is_admin": user.is_admin}

# 2. SECURITY CODES (Admin Only)
@app.get("/config/security-codes", response_model=List[SecurityCodeResponse])
def get_security_codes(db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    codes = db.query(SecurityCodeDB).all()
    results = []
    for c in codes:
        used_by = ""
        if c.is_used and c.used_by:
            used_by = c.used_by.username
        results.append({
            "code": c.code,
            "is_used": c.is_used,
            "used_by_username": used_by
        })
    return results

@app.post("/config/security-codes")
def create_security_code(item: SecurityCodeCreate, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if not item.code: raise HTTPException(400, "Code empty")
    
    exists = db.query(SecurityCodeDB).filter(SecurityCodeDB.code == item.code).first()
    if exists: raise HTTPException(400, "Code already exists")
    
    new_code = SecurityCodeDB(code=item.code, created_by_user_id=current_user.id)
    db.add(new_code)
    db.commit()
    return {"message": "Created"}

@app.delete("/config/security-codes/{code}")
def delete_security_code(code: str, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
        
    db_code = db.query(SecurityCodeDB).filter(SecurityCodeDB.code == code).first()
    if db_code:
        db.delete(db_code)
        db.commit()
    return {"message": "Deleted"}

# 3. TASKS
@app.get("/tasks", response_model=List[TaskResponse])
def read_tasks(db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    tasks = db.query(TaskDB).filter(TaskDB.user_id == current_user.id).order_by(TaskDB.created_at.desc()).all()
    results = []
    for t in tasks:
        results.append({
            "id": t.id,
            "description": t.description,
            "category_name": t.category.name if t.category else "",
            "owner_name": t.owner.name if t.owner else "",
            "priority": t.priority,
            "status": t.status,
            "due_date": t.due_date,
            "is_important": t.is_important,
            "is_urgent": t.is_urgent,
            "notes": t.notes,
            "created_at": t.created_at
        })
    return results

@app.post("/tasks")
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    cat = get_or_create_category(db, task.category_name, current_user.id)
    own = get_or_create_owner(db, task.owner_name, current_user.id)

    db_task = TaskDB(
        description=task.description,
        category_id=cat.id if cat else None,
        owner_id=own.id if own else None,
        user_id=current_user.id,
        priority=task.priority,
        status=task.status,
        due_date=task.due_date,
        is_important=task.is_important,
        is_urgent=task.is_urgent,
        notes=task.notes
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return {"message": "Created", "id": db_task.id}

@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: TaskCreate, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    db_task = db.query(TaskDB).filter(TaskDB.id == task_id, TaskDB.user_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    cat = get_or_create_category(db, task.category_name, current_user.id)
    own = get_or_create_owner(db, task.owner_name, current_user.id)

    db_task.description = task.description
    db_task.category_id = cat.id if cat else None
    db_task.owner_id = own.id if own else None
    db_task.priority = task.priority
    db_task.status = task.status
    db_task.due_date = task.due_date
    db_task.is_important = task.is_important
    db_task.is_urgent = task.is_urgent
    db_task.notes = task.notes

    db.commit()
    return {"message": "Updated"}

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    task = db.query(TaskDB).filter(TaskDB.id == task_id, TaskDB.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Deleted"}

# 4. CONFIG
@app.get("/config")
def get_config(db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    cats = [c.name for c in db.query(CategoryDB).filter(CategoryDB.user_id == current_user.id).order_by(CategoryDB.id).all()]
    owners = [o.name for o in db.query(OwnerDB).filter(OwnerDB.user_id == current_user.id).order_by(OwnerDB.id).all()]
    
    if not cats: cats = ['Finance', 'Marketing', 'HR', 'Legal', 'Admin', 'IT']
    if not owners: owners = ['Me', 'John', 'Alice', 'Bob', 'Sarah']
    
    return {"categories": cats, "owners": owners}

@app.post("/config/categories")
def add_category(item: ConfigItem, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    if not item.name: raise HTTPException(400, "Name empty")
    exists = db.query(CategoryDB).filter(CategoryDB.name == item.name, CategoryDB.user_id == current_user.id).first()
    if exists: return {"message": "Exists"}
    
    new_cat = CategoryDB(name=item.name, user_id=current_user.id)
    db.add(new_cat)
    db.commit()
    return {"message": "Added"}

@app.delete("/config/categories/{name}")
def delete_category(name: str, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    cat = db.query(CategoryDB).filter(CategoryDB.name == name, CategoryDB.user_id == current_user.id).first()
    if cat:
        tasks = db.query(TaskDB).filter(TaskDB.category_id == cat.id).all()
        for t in tasks: t.category_id = None
        db.delete(cat)
        db.commit()
    return {"message": "Deleted"}

@app.post("/config/owners")
def add_owner(item: ConfigItem, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    if not item.name: raise HTTPException(400, "Name empty")
    exists = db.query(OwnerDB).filter(OwnerDB.name == item.name, OwnerDB.user_id == current_user.id).first()
    if exists: return {"message": "Exists"}
    
    new_owner = OwnerDB(name=item.name, user_id=current_user.id)
    db.add(new_owner)
    db.commit()
    return {"message": "Added"}

@app.delete("/config/owners/{name}")
def delete_owner(name: str, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    owner = db.query(OwnerDB).filter(OwnerDB.name == name, OwnerDB.user_id == current_user.id).first()
    if owner:
        tasks = db.query(TaskDB).filter(TaskDB.owner_id == owner.id).all()
        for t in tasks: t.owner_id = None
        db.delete(owner)
        db.commit()
    return {"message": "Deleted"}

# 5. BIRTHDAYS
@app.get("/birthdays", response_model=List[BirthdayResponse])
def get_birthdays(db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    return db.query(BirthdayDB).filter(BirthdayDB.user_id == current_user.id).all()

@app.post("/birthdays", response_model=BirthdayResponse)
def create_birthday(item: BirthdayCreate, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    if not item.name: raise HTTPException(400, "Name required")
    if not (1 <= item.day <= 31) or not (1 <= item.month <= 12):
         raise HTTPException(400, "Invalid Date")
         
    new_bday = BirthdayDB(name=item.name, day=item.day, month=item.month, user_id=current_user.id)
    db.add(new_bday)
    db.commit()
    db.refresh(new_bday)
    return new_bday

@app.delete("/birthdays/{bday_id}")
def delete_birthday(bday_id: int, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    bday = db.query(BirthdayDB).filter(BirthdayDB.id == bday_id, BirthdayDB.user_id == current_user.id).first()
    if bday:
        db.delete(bday)
        db.commit()
    return {"message": "Deleted"}
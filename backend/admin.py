from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext
from typing import List

from schemas import AdminLogin, UserOut
from db import get_db
from models import User

from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "default_secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
auth_scheme = HTTPBearer()


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: AsyncSession = Depends(get_db),
):
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.email == email))
    admin = result.scalar_one_or_none()

    if not admin or admin.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized as admin")
    return admin


@router.post("/login", tags=["Admin"])
async def admin_login(admin: AdminLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == admin.adminEmail))
    db_user = result.scalar_one_or_none()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if db_user.role != "admin":
        raise HTTPException(status_code=403, detail="You are not authorized as admin")

    if not pwd_context.verify(admin.adminPassword, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(data={"sub": db_user.email, "role": db_user.role})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/admin-dashboard", tags=["Admin"], response_model=List[UserOut])
async def admin_dashboard(
    current_admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users


@router.delete("/admin-delete-user/{id}", tags=["Admin"])
async def delete_user_by_id(
    id: int,
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(get_current_admin),
):
    result = await db.execute(select(User).where(User.id == id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.delete(user)
    await db.commit()

    return {"message": "User deleted successfully"}

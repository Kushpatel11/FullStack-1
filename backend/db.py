# db.py
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os
import ssl

load_dotenv()  # Load environment variables from .env

DATABASE_URL = os.getenv("DATABASE_URL_POSTGRES")
print(f"DATABASE_URL: {DATABASE_URL}")
if DATABASE_URL is None:
    raise ValueError("DATABASE_URL_POSTGRES not found in .env file")


# Create SSL context for secure connection
ssl_context = ssl.create_default_context()

# Create async engine with SSL (Render requires SSL)
engine = create_async_engine(
    DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://"),
    echo=True,
    connect_args={"ssl": ssl_context},
)

# Correct sessionmaker name
async_session = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()


# Use correct session factory
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session

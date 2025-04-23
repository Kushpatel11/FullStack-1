from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import Base, engine
from user import router as auth_router
from admin import router as admin_router
import logging

logging.basicConfig(level=logging.DEBUG)


# Create tables asynchronously
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# FastAPI app setup
app = FastAPI()

# CORS middleware for Angular frontend (local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Only during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(admin_router, prefix="/admin", tags=["Admin"])

# Mount Angular frontend


@app.on_event("startup")
async def on_startup():
    await create_tables()


@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI app!"}

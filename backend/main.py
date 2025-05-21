import asyncio

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import photo_routes, user_routes, building_routes
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads/photos")
UPLOAD_URL_PATH = os.getenv("UPLOAD_URL_PATH", "static/photos")

app.mount(f"/{UPLOAD_URL_PATH}", StaticFiles(directory=UPLOAD_DIR), name="static-photos")

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])

app.include_router(user_routes.router, prefix="/users", tags=["Users"])
app.include_router(photo_routes.router, prefix="/photos", tags=["Photos"])
app.include_router(building_routes.router, prefix="/buildings", tags=["Buildings"])


if __name__ == '__main__':
    uvicorn.run(app, host="127.0.0.1", port=8000)
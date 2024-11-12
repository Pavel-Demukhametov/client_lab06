from fastapi import FastAPI
from app.config import setup_database
from app.api.routes import router as api_router
from app.api.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Или укажите конкретные адреса, например ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все HTTP-методы
    allow_headers=["*"],  # Разрешить все заголовки
)
setup_database()

app.include_router(auth_router, prefix="")

app.include_router(api_router)
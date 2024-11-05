from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt  # используем pyjwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# Секретный ключ для создания JWT токенов
SECRET_KEY = "your_secret_key_here"  # Замените на ваш секретный ключ
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")  # Убедитесь, что tokenUrl начинается с /

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Создаёт JWT токен.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[str]:
    """
    Верифицирует JWT токен и возвращает имя пользователя.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"require": ["exp"]})
        username: str = payload.get("sub")
        if username is None:
            return None
        return username
    except jwt.ExpiredSignatureError:
        # Токен истёк
        return None
    except jwt.InvalidTokenError:
        # Токен недействителен
        return None

def verify_password(plain_password: str, stored_password: str) -> bool:
    """
    Проверяет совпадение пароля.
    """
    return plain_password == stored_password

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    """
    Получает текущего пользователя из токена.
    """
    username = verify_token(token)
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Невалидный токен",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return username
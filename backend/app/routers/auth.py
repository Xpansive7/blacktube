"""
Rotas de autenticação: registro, login, obter usuário atual
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import get_settings
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt

router = APIRouter(prefix="/auth", tags=["authentication"])


def hash_password(password: str) -> str:
    """Hash de senha com bcrypt (trunca em 72 bytes)"""
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha corresponde ao hash"""
    pwd_bytes = plain_password.encode("utf-8")[:72]
    hash_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(pwd_bytes, hash_bytes)


def create_access_token(data: dict, settings) -> str:
    """Cria JWT token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.secret_key, algorithm=settings.algorithm
    )
    return encoded_jwt


def get_current_user(
    token: str, db: Session = Depends(get_db), settings=Depends(get_settings)
) -> User:
    """Dependency para obter usuário autenticado via JWT"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception

    return user


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Registra novo usuário"""
    # Verificar se email já existe
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já registrado",
        )

    # Verificar se username já existe
    existing_username = db.query(User).filter(User.username == user_data.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username já registrado",
        )

    # Criar novo usuário
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hash_password(user_data.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=TokenResponse)
def login(
    credentials: UserLogin, db: Session = Depends(get_db), settings=Depends(get_settings)
):
    """Login de usuário"""
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
        )

    # Criar token
    access_token = create_access_token(
        data={"sub": user.email}, settings=settings
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    token: str = Depends(get_current_user),
):
    """Retorna informações do usuário autenticado"""
    return token

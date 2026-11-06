from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session, declarative_base

# O banco fica sempre ao lado deste arquivo, independentemente da pasta
# de onde o backend for iniciado.
BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = (BASE_DIR / "db.sqlite3").as_posix()

db = create_engine(
    f"sqlite:///{DATABASE_PATH}",
    connect_args={"check_same_thread": False},
)
Session = sessionmaker(bind=db)

# Sessão por thread/requisição: evita compartilhar a mesma sessão entre
# requisições concorrentes do Flask.
session = scoped_session(Session)

Base = declarative_base()

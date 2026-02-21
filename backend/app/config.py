import hashlib
import os

DATABASE_URL = os.getenv("DATABASE_URL")

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
AUTH_USERNAME = os.getenv("AUTH_USERNAME", "admin")
AUTH_PASSWORD = os.getenv("AUTH_PASSWORD", "admin")
AUTH_PASSWORD_HASH = hashlib.sha256(AUTH_PASSWORD.encode("utf-8")).hexdigest()

from jose import jwt, JWTError
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta, timezone

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")


# ---------------- VALIDATION ----------------
if not SECRET_KEY:raise Exception("SECRET_KEY is missing in .env")

if not ALGORITHM:raise Exception("ALGORITHM is missing in .env")

if not ACCESS_TOKEN_EXPIRE_MINUTES:ACCESS_TOKEN_EXPIRE_MINUTES = "30"

ACCESS_TOKEN_EXPIRE_MINUTES = int(ACCESS_TOKEN_EXPIRE_MINUTES)


# ---------------- CREATE TOKEN ----------------
def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ---------------- VERIFY TOKEN ----------------
def verify_token(token: str):
    try:
        payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
    except Exception:
        return None
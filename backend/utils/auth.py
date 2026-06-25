from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.jwt_handler import verify_token

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        if not credentials or not credentials.credentials:raise HTTPException(status_code=401, detail="Token missing")
        token = credentials.credentials
        payload = verify_token(token)

        if payload is None:raise HTTPException(status_code=401, detail="Invalid or expired token")
        return payload

    except Exception as e: 
        raise HTTPException(status_code=401,detail=f"Authentication failed: {str(e)}")
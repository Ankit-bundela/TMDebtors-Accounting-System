from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datalayer.managers import UserManager
from datalayer.entities import User
import json

router = APIRouter()

# Request body models
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/registerUser")
def register_user(request: RegisterRequest):
    manager = UserManager()

    if manager.getByEmail(request.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(name=request.name, email=request.email, password=request.password, role=request.role)
    manager.add(user)
    return {"success": True, "message": "User registered successfully"}


@router.post("/loginUser")
def login_user(request: LoginRequest):
    manager = UserManager()
    user = manager.getByEmail(request.email)

    if not user or not manager.validate_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "success": True,
        "data": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "createdAt": user.createdAt.strftime("%Y-%m-%d")
        }
    }
    
@router.get("/getAllUsers")
def get_all_users():
    manager = UserManager()
    try:
        users = manager.getAll()
        return {"success": True, "data": users}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Unable to fetch users: " + str(e))
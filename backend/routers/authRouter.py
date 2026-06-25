from fastapi import APIRouter, HTTPException,Depends
from models import *

from datalayer.managers import UserManager
from datalayer.entities import User
from utils.auth import get_current_user
from utils.jwt_handler import create_access_token


router = APIRouter()

#Register User
@router.post("/registerUser")
def register_user(request: RegisterRequest):
    manager = UserManager()
    if manager.getByEmail(request.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(name=request.name, email=request.email, password=request.password, role=request.role)
    manager.add(user)
    return {"success": True, "message": "User registered successfully"}


#Login User (Jwt token generate)
@router.post("/loginUser")
def login_user(request: LoginRequest):
    manager = UserManager()
    user = manager.getByEmail(request.email)

    if not user or not manager.validate_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token({
        "user_id": user.id,
        "email": user.email,
        "role": user.role
    })


    return {
        "success": True,
        "token":token,
        "data": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "createdAt": user.createdAt.strftime("%Y-%m-%d")
        }
    }
    
@router.get("/getAllUsers")
def get_all_users(user=Depends(get_current_user)):
    manager = UserManager()
    try:
        users = manager.getAll()
        return {"success": True, "data": users,"loggedInUser": user}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Unable to fetch users: " + str(e))
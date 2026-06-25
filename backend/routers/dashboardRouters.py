from fastapi import APIRouter, HTTPException,Depends
from datalayer.managers import DashBoardManager
from utils.auth import get_current_user

router = APIRouter()
@router.get("/getDashboard")
def getDashboard(user=Depends(get_current_user)):
    try:
        manager = DashBoardManager()
        data = manager.getDashboard()

        return {
            "success": True,
            "data": data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
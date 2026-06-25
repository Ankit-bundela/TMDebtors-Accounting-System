from fastapi import APIRouter

router = APIRouter()

@router.get("/server-status")
def server_status():
    # React app expects "ready" string
    return {"status": "ready"}
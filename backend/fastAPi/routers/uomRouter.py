from fastapi import APIRouter,HTTPException,status
from datalayer.managers import UnitofMeasurmentManager
from datalayer.exceptions import DataLayerException
import time

router=APIRouter()

@router.get("/getUnitOfMeasurments",status_code=status.HTTP_200_OK)
def getUnitOfMeasurments():
    try:
        time.sleep(3)
        manager = UnitofMeasurmentManager()
        rows = manager.getAll()
        data=[]
        for row in rows:
            data.append({"code": row.code,"name": row.name})
        return{"success": True,"data":data}
        
    except DataLayerException as e:
        return{"success": False,"error": e.message}
        
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/getAllUOMs")
def getAllUOMs():
    try:
        manager = UnitofMeasurmentManager()
        rows = manager.getAll()
        data=[]
        for row in rows:
            item={
                "code":row.code,
                "name":row.name
            }
            data.append(item)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(e))

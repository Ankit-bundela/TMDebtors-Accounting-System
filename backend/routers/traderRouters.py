from fastapi import APIRouter,HTTPException,status,Depends
from utils.auth import get_current_user
from models import TraderModel,DeleteTraderModel
from datalayer.entities import Traders
from datalayer.managers import TraderManager
from datalayer.exceptions import DataLayerException

router=APIRouter()

@router.post("/addTrader")
def postAddTrader(trader_data:TraderModel,user=Depends(get_current_user)):
    try:
        trader = Traders(
            None,
            trader_data.name,
            trader_data.address,
            trader_data.gstNum,
            trader_data.regTitle1,
            trader_data.regValue1,
            trader_data.contact1,
            trader_data.contact2,
            trader_data.stateCode,
            trader_data.bankName,
            trader_data.accountNo,
            trader_data.branchName,
            trader_data.ifscCode
        )

        manager = TraderManager()
        manager.add(trader)

        return {
            "success": True,
            "message": "Trader added successfully"
        }

    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=e.message)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    



@router.put("/updateTrader")
def postUpdateTrader(trader_data: TraderModel,user=Depends(get_current_user)):
    try:
        if not trader_data.code:
            raise HTTPException(status_code=400, detail="Code is required for update")

        trader = Traders(
            trader_data.code,
            trader_data.name,
            trader_data.address,
            trader_data.gstNum,
            trader_data.regTitle1,
            trader_data.regValue1,
            trader_data.contact1,
            trader_data.contact2,
            trader_data.stateCode,
            trader_data.bankName,
            trader_data.accountNo,
            trader_data.branchName,
            trader_data.ifscCode
        )

        manager = TraderManager()
        manager.update(trader)

        return {"success": True, "message": "Trader updated successfully"}

    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=e.message)    


@router.delete("/removeTrader/{code}")
def removeTrader(code: int,user=Depends(get_current_user)):
    try:
        manager = TraderManager()
        manager.remove(code)

        return {"success": True, "message": "Trader deleted successfully"}

    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=e.message)

@router.get('/getTraders')
def getTraders(user=Depends(get_current_user)):
    try:
        manager = TraderManager()
        traders = manager.getAll()

        return {
            "success": True,
            "data": traders
        }

    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=e.message)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
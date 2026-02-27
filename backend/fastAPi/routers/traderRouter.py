from fastapi import APIRouter,HTTPException,status
from models import TraderModel
from datalayer.entities import Traders
from datalayer.managers import TraderManager
from datalayer.exceptions import DataLayerException

router=APIRouter()
@router.get('/getTrader')
def getTrader():
    try:
        manager = TraderManager()
        trader = manager.getAll()
        if not trader:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Trader not found")
        data = {
            "code": trader.code,
            "name": trader.name,
            "address": trader.address,
            "gstNum": trader.gstNum,
            "regTitle1": trader.regTitle1,
            "regValue1": trader.regValue1,
            "contact1": trader.contact1,
            "contact2": trader.contact2,
            "stateCode": trader.stateCode,
            "bankName": trader.bankName,
            "accountNo": trader.accountNo,
            "branchName": trader.branchName,
            "ifscCode": trader.ifscCode
        }
        return{"success": True,"data": data}

    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=e.message)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    



@router.post("/updateTrader")
def postUpdateTrader(trader_data:TraderModel):
    try:
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

        return {
            "success": True,
            "message": "Trader updated successfully"
        }

    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=e.message)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
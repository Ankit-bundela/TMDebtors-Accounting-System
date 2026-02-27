from fastapi import APIRouter,HTTPException,status
from datalayer.managers import StateManager
from datalayer.exceptions import DataLayerException
router=APIRouter()


@router.get('/getStates')
def getStates():
    try:
        manager = StateManager()
        states = manager.getAll()
        data = []
        for state in states:
            data.append({
                "code": state.code,
                "name": state.name,
                "alphaCode": state.alphaCode
            })
        return{"success": True,"data":data}        
    except DataLayerException as e:
        return{"success": False, "error": e.message}        
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@router.get('/getStateByCode')
def getStateByCode(code:int):
    try:
        manager = StateManager()
        state = manager.getByCode(code)
        if not state:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"No state found with code {code}")
          
        return{
            "success": True,
            "data": {
                "code": state.code,
                "name": state.name,
                "alphaCode": state.alphaCode
            }
        }
    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=e.message)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/getStateByAlphaCode")
def getStateByAlphaCode(alphaCode: str):   
    try:
        if not alphaCode:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="State alpha code is required"
            )

        manager = StateManager()
        state = manager.getByAlphaCode(alphaCode.strip())

        if not state:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No state found with alpha code {alphaCode}"
            )

        return {
            "success": True,
            "data": {
                "code": state.code,
                "name": state.name,
                "alphaCode": state.alphaCode
            }
        }

    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=e.message)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
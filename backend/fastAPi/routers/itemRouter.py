from fastapi import APIRouter, HTTPException,status
from datalayer.managers import *
from datalayer.managers import ItemManager
from datalayer.exceptions import DataLayerException
from models import *
import time

router = APIRouter()
@router.get("/getItems",status_code=status.HTTP_200_OK)
def getItems():
    try:
        data= []
        manager = ItemManager()
        items = manager.getAll()

        for item in items:
            item_dict = {
                "code": item.code,
                "name": item.name,
                "cgst": item.cgst,
                "sgst": item.sgst,
                "igst": item.igst,
                "hsnCode": item.hsnCode,
                "unitofMeasurments": []
            }

            if item.unitofMeasurments:
                for uom in item.unitofMeasurments:
                    item_dict["unitofMeasurments"].append({
                        "code": uom.code,
                        "name": uom.name
                    })

            data.append(item_dict)

        return {
            "success": True,
            "data": data
        }

    except DataLayerException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    


@router.get("/getItemsDetails",status_code=status.HTTP_200_OK)
def getItemsDetails():
    try:
        #timePass(3000)
        time.sleep(3)
        manager = ItemManager()
        items = manager.getAll()
        data= []
        for item in items:
            item_dict = {
                "code": item.code,
                "name": item.name,
                "cgst": item.cgst,
                "sgst": item.sgst,
                "igst": item.igst,
                "hsnCode": item.hsnCode,
                "unitofMeasurments": []
            }
            if item.unitofMeasurments:
                for uom in item.unitofMeasurments:
                    item_dict["unitofMeasurments"].append({
                        "code": uom.code,
                        "name": uom.name
                    })
            data.append(item_dict)
        return {"success": True,"data": data}
    except DataLayerException as e:
        return {"success": False,"error": e.message}
    except Exception as e:
        return {"success": False,"error": str(e)}

@router.post('/addItem', status_code=status.HTTP_201_CREATED)
def postaddItem(item_data: ItemModel):
    try:
        manager = ItemManager()
        manager.add(item_data)
        return {
            "success": True,
            "message": "Item added successfully",
            "itemCode": item_data.code
        }
    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/updateItem")
def postUpdateItem(item_data: ItemModel):
    try:
        print("Received Data:", item_data)
        uoms=[]
        code = item_data.code

        for u in item_data.unitofMeasurments:
            uom = UnitofMeasurement(
            code=u.code,
            name=u.name
        )
        uoms.append(uom)

        item = Item(
            code=code,
            name=item_data.name,
            hsnCode=item_data.hsnCode,
            cgst=item_data.cgst,
            sgst=item_data.sgst,
            igst=item_data.igst,
            unitofMeasurments=uoms
        )

        manager = ItemManager()
        manager.update(item)

        return {
            "success": True,
            "message": f"Item {code} updated successfully"
        }

    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/deleteItem", status_code=status.HTTP_200_OK)
def deleteItem(request: DeleteItemModel):
    try:
        code = request.code
        manager = ItemManager()
        
        # Check if item exists
        existing = manager.getByCode(code)
        if not existing:
            raise HTTPException(status_code=404, detail=f"Item with code {code} does not exist")
        
        manager.remove(code)
        
        return {"success": True, "message": f"Item {code} deleted successfully"}
    
    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
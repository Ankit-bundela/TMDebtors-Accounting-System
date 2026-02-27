from fastapi import HTTPException,APIRouter,status,Request
from models import CustomerModel
from datalayer.entities import Traders
from datalayer.managers import CustomerManager
from datalayer.exceptions import DataLayerException
from models import DeleteCustomerModel
from fastapi import Form

router=APIRouter()

@router.get("/getCustomers", status_code=status.HTTP_200_OK)
def getCustomers():
    try:
        manager = CustomerManager()
        customers = manager.getAll()
        return {"success": True, "data": customers}

    except DataLayerException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error"
        )

@router.post('/addCustomer', status_code=201)
def postAddCustomer(
    name: str = Form(...),
    address: str = Form(...),
    stateCode: int = Form(1),
    regTitle1: str = Form(None),
    regValue1: str = Form(None),
    regTitle2: str = Form(None),
    regValue2: str = Form(None),
    regTitle3: str = Form(None),
    regValue3: str = Form(None),
    contact1: str = Form(None),
    contact2: str = Form(None),
    contact3: str = Form(None),
):
    try:
        manager = CustomerManager()

        # ✅ Convert Form data to CustomerModel
        customer_obj = CustomerModel(
            name=name,
            address=address,
            stateCode=stateCode,
            regTitle1=regTitle1,
            regValue1=regValue1,
            regTitle2=regTitle2,
            regValue2=regValue2,
            regTitle3=regTitle3,
            regValue3=regValue3,
            contact1=contact1,
            contact2=contact2,
            contact3=contact3
        )

        manager.add(customer_obj)

        return {
            "success": True,
            "message": "Customer added successfully",
            "customerCode": customer_obj.code
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@router.post("/updateCustomer", status_code=200)
def postUpdateCustomer(
    code: int = Form(...),
    name: str = Form(None),
    address: str = Form(None),
    regTitle1: str = Form(None),
    regValue1: str = Form(None),
    regTitle2: str = Form(None),
    regValue2: str = Form(None),
    regTitle3: str = Form(None),
    regValue3: str = Form(None),
    contact1: str = Form(None),
    contact2: str = Form(None),
    contact3: str = Form(None),
    stateCode: int = Form(None)
):
    try:
        manager = CustomerManager()

        existing_customer = manager.getByCode(code)
        if not existing_customer:
            raise HTTPException(status_code=404, detail="Customer not found")

        updated_customer = existing_customer.copy()

        if name is not None:
            updated_customer["name"] = name
        if address is not None:
            updated_customer["address"] = address
        if regTitle1 is not None:
            updated_customer["regTitle1"] = regTitle1
        if regValue1 is not None:
            updated_customer["regValue1"] = regValue1
        if regTitle2 is not None:
            updated_customer["regTitle2"] = regTitle2
        if regValue2 is not None:
            updated_customer["regValue2"] = regValue2
        if regTitle3 is not None:
            updated_customer["regTitle3"] = regTitle3
        if regValue3 is not None:
            updated_customer["regValue3"] = regValue3
        if contact1 is not None:
            updated_customer["contact1"] = contact1
        if contact2 is not None:
            updated_customer["contact2"] = contact2
        if contact3 is not None:
            updated_customer["contact3"] = contact3
        if stateCode is not None:
            updated_customer["stateCode"] = stateCode

        manager.update(updated_customer)

        return {
            "success": True,
            "message": "Customer updated successfully"
        }

    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.post("/removeCustomer", status_code=200)    
def postRemoveCustomer(code: int = Form(...)):

    manager = CustomerManager()

    existing_customer = manager.getByCode(code)
    if not existing_customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    if manager.hasInvoices(code):
        raise HTTPException(
            status_code=400,
            detail="Cannot delete customer. Related invoices exist."
        )

    manager.remove(code)

    return {
        "success": True,
        "message": "Customer removed successfully"
    }

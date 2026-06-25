from fastapi import APIRouter, HTTPException, Query, status,Depends
from models import *
from datalayer.managers import *
from datalayer.exceptions import DataLayerException
from datalayer.entities import InvoiceItem
from utils.auth import get_current_user

router = APIRouter()


# ---------------- ADD INVOICE ----------------
@router.post("/addInvoice")
def postAddInvoice(invoice: InvoiceModel, user=Depends(get_current_user)):
    try:
        if not invoice.invoiceDate:
            raise HTTPException(status_code=400, detail="invoiceDate is required")

        manager = InvoiceManager()
        invoice_code= manager.add(invoice)

        return {
            "success": True,
            "invoiceCode": invoice_code
        }

    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------- GET ALL INVOICES ----------------
@router.get("/getAllInvoices", status_code=status.HTTP_200_OK)
def get_all_invoices(user=Depends(get_current_user)):
    try:
        manager = InvoiceManager()
        data = manager.getAll()

        return {
            "success": True,
            "data": data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# ---------------- DELETE INVOICE ----------------
@router.delete("/deleteInvoice", status_code=status.HTTP_200_OK)
def delete_invoice(payload: DeleteInvoiceModel, user=Depends(get_current_user)):
    try:
        manager = InvoiceManager()
        manager.delete(payload.code)

        return {
            "success": True,
            "message": f"Invoice {payload.code} deleted successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/getInvoiceDetails", status_code=status.HTTP_200_OK)
def get_invoice_details(invoiceCode: int = Query(...), user=Depends(get_current_user)):
    try:
        manager = InvoiceManager()
        result = manager.getInvoiceDetails(invoiceCode)

        invoice = result["invoice"]
        items = result["items"]

        items_data = []

        for i in items:
            items_data.append({
                "itemCode": getattr(i, "itemCode", None) or (i.get("itemCode") if isinstance(i, dict) else None),
                "rate": getattr(i, "rate", None) or (i.get("rate") if isinstance(i, dict) else None),
                "quantity": getattr(i, "quantity", None) or (i.get("quantity") if isinstance(i, dict) else None),
                "sgst": getattr(i, "sgst", None) or (i.get("sgst") if isinstance(i, dict) else None),
                "cgst": getattr(i, "cgst", None) or (i.get("cgst") if isinstance(i, dict) else None),
                "igst": getattr(i, "igst", None) or (i.get("igst") if isinstance(i, dict) else None),
                "taxableAmount": getattr(i, "taxableAmount", None) or (i.get("taxableAmount") if isinstance(i, dict) else None),
                "totalAmount": getattr(i, "totalAmount", None) or (i.get("totalAmount") if isinstance(i, dict) else None),
            })

        return {
            "success": True,
            "data": {

                # ✅ SAFE ACCESS (NO ERROR NOW)
                "code": invoice.get("invoice_code") or invoice.get("INVOICE_CODE"),

                "customerCode": invoice.get("customer_code") or invoice.get("CUSTOMER_CODE"),
                "customerName": invoice.get("customer_name") or invoice.get("CUSTOMER_NAME"),

                "traderCode": invoice.get("trader_code") or invoice.get("TRADER_CODE"),
                "traderName": invoice.get("trader_name") or invoice.get("TRADER_NAME"),

                "state": invoice.get("state_name") or invoice.get("STATE_NAME"),

                "invoiceDate": invoice.get("invoice_date") or invoice.get("INVOICE_DATE"),
                "createdOn": invoice.get("created_on") or invoice.get("CREATED_ON"),

                "items": items_data,

                "totalAmount": invoice.get("total_amount") or invoice.get("TOTAL_AMOUNT") or 0
            }
        }

    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/getInvoices")
def get_invoices(user=Depends(get_current_user)):
    manager = InvoiceManager()
    data = manager.getAll()

    return {
        "success": True,
        "data": data
    }
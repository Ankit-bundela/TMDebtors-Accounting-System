from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional, List
from models import InvoiceModel,InvoiceItemModel, DeleteInvoiceModel
from datalayer.managers import InvoiceManager
from datalayer.exceptions import DataLayerException
from datetime import datetime
from datalayer.managers import InvoiceItemManager
from datalayer.entities import InvoiceItem

router = APIRouter()

@router.get("/getAllInvoices", status_code=status.HTTP_200_OK)
def getAllinvoices():
    try:
        manager = InvoiceManager()
        invoices = manager.getAll()
        return {"success": True, "data": invoices}
    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/addInvoice", status_code=status.HTTP_201_CREATED)
def postAddInvoice(invoice: InvoiceModel):
    try:
        if not invoice.invoiceDate:
            raise HTTPException(status_code=400, detail="invoiceDate is required")

        manager = InvoiceManager()
        code = manager.add(invoice)
        return {"success": True, "message": "Invoice created successfully.", "invoiceCode": code}
    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
from fastapi import APIRouter, HTTPException, Query, status





@router.get("/getInvoiceDetails", status_code=status.HTTP_200_OK)
def getInvoiceDetails(invoiceCode: int = Query(..., description="Invoice code to fetch details")):
    """
    Fetch invoice details along with its items.
    Returns totalAmount calculated from items.
    """
    try:
        manager = InvoiceManager()
        invoice, items = manager.getInvoiceDetails(invoiceCode)

        # Prepare items list
        items_data = []
        for i in items:
            items_data.append({
                "itemCode": i.getItemCode(),
                "rate": i.getRate(),
                "quantity": i.getQuantity(),
                "sgst": i.getSgst(),
                "cgst": i.getCgst(),
                "igst": i.getIgst(),
                "taxableAmount": i.getTaxableAmount(),
                "totalAmount": i.getTotalAmount()
            })

        # Calculate totalAmount from items
        total_amount = sum(item["totalAmount"] for item in items_data)

        # Prepare invoice data
        invoice_data = {
            "code": invoice.getCode(),
            "customerCode": invoice.getCustomerCode(),
            "invoiceDate": invoice.getInvoiceDate().strftime("%Y-%m-%d") if invoice.getInvoiceDate() else "Unknown",
            "createdOn": invoice.getCreatedOn().strftime("%Y-%m-%d") if invoice.getCreatedOn() else "Not Created",
            "items": items_data,
            "totalAmount": total_amount
        }

        return {"success": True, "data": invoice_data}

    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/addInvoiceItem", status_code=status.HTTP_201_CREATED)
def postAddInvoiceItem(item: InvoiceItemModel):
    try:
        # Server calculates amounts
        taxableAmount = item.rate * item.quantity
        totalAmount = taxableAmount + (taxableAmount * (item.sgst + item.cgst + item.igst)/100)

        invoice_item = InvoiceItem(
            invoiceCode=item.invoiceCode,
            itemCode=item.itemCode,
            rate=item.rate,
            quantity=item.quantity,
            sgst=item.sgst,
            cgst=item.cgst,
            igst=item.igst,
            taxableAmount=taxableAmount,
            totalAmount=totalAmount
        )

        manager = InvoiceItemManager()
        manager.add(invoice_item)

        return {"success": True, "message": "Invoice Item added successfully."}

    except DataLayerException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
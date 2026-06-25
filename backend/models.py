from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime

class UnitOfMeasurement(BaseModel):
    code: int
    name: Optional[str]

class ItemModel(BaseModel):
    code: Optional[int]
    name: str
    cgst: float
    sgst: float
    igst: float
    hsnCode: str
    unitofMeasurments: List[UnitOfMeasurement]

class DeleteItemModel(BaseModel):
    code: int

class State(BaseModel):
    code: int
    name: str
    alphaCode: str

class CustomerModel(BaseModel):
    code: Optional[int]=None
    name: Optional[str] = None
    address: Optional[str]=None
    regTitle1: Optional[str] = None
    regValue1: Optional[str] = None
    regTitle2: Optional[str] = None
    regValue2: Optional[str] = None
    regTitle3: Optional[str] = None
    regValue3: Optional[str] = None
    contact1: Optional[str] = None
    contact2: Optional[str] = None
    contact3: Optional[str] = None
    stateCode:  Optional[int] = None

class DeleteCustomerModel(BaseModel):
    code: int

class TraderModel(BaseModel):
    code: Optional[int]=None
    name: str
    address: str
    
    gstNum: Optional[str] = None
    regTitle1: Optional[str] = None
    regValue1: Optional[str] = None
    contact1: Optional[str] = None
    contact2: Optional[str] = None
    
    stateCode: int
    
    bankName: Optional[str] = None
    accountNo: Optional[str] = None
    branchName: Optional[str] = None
    ifscCode: Optional[str] = None

class DeleteTraderModel(BaseModel):
    code: int
    
class InvoiceItemModel(BaseModel):
    invoiceCode: Optional[int] = None
    itemCode: int
    rate: float
    quantity: float
    sgst: float = 0
    cgst: float = 0
    igst: float = 0


class InvoiceModel(BaseModel):
    code: Optional[int] = None
    customerCode: int
    traderCode: int
    invoiceDate: date
    totalAmount: Optional[float] = 0.0
    createdOn: Optional[datetime] = None
    items: List[InvoiceItemModel] = []   # FIXED

class DeleteInvoiceModel(BaseModel):
    code: int


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str









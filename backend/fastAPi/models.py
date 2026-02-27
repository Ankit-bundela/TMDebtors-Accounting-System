from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime

class UnitOfMeasurement(BaseModel):
    code: int
    name: str

class ItemModel(BaseModel):
    code: int
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






class TraderModel(BaseModel):
    code: int
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


class BankDetails(BaseModel):
    code: int
    traderCode: Optional[int] = None
    customerCode: Optional[int] = None
    bankName: str
    accountNo: str
    ifscCode: str

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
    invoiceDate: date
    totalAmount: Optional[float] = 0.0
    createdOn: Optional[datetime] = None
    items: Optional[List[InvoiceItemModel]] = []
    
class DeleteInvoiceModel(BaseModel):
    code: int


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    createdAt: datetime


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

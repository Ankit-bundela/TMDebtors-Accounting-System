class UnitofMeasurement:
    def __init__(self, code, name):
        self.code = code
        self.name = name

    def getCode(self):
        return self.code

    def getName(self):
        return self.name


class Item:
    def __init__(self, code, name, cgst, sgst, igst, hsnCode, unitofMeasurments):
        self.code = code
        self.name = name
        self.cgst = cgst
        self.sgst = sgst
        self.igst = igst
        self.hsnCode = hsnCode
        self.unitofMeasurments = unitofMeasurments

    def getCode(self):
        return self.code

    def getHsnCode(self):
        return self.hsnCode

    def getName(self):
        return self.name

    def getCGST(self):
        return self.cgst

    def getSGST(self):
        return self.sgst

    def getIGST(self):
        return self.igst

    def getUnitofMeasurment(self):
        return self.unitofMeasurments


class State:
    def __init__(self, code, name, alphaCode):
        self.code = code
        self.name = name
        self.alphaCode = alphaCode

    def getCode(self):
        return self.code

    def getName(self):
        return self.name

    def getAlphaCode(self):
        return self.alphaCode


class Traders:
    def __init__(self, code, name, address, gstNum, regTitle1, regValue1, contact1, contact2, stateCode, bankName, accountNo, branchName, ifscCode):
        self.code = code
        self.name = name
        self.address = address
        self.gstNum = gstNum
        self.regTitle1 = regTitle1
        self.regValue1 = regValue1
        self.contact1 = contact1
        self.contact2 = contact2
        self.stateCode = stateCode
        self.bankName = bankName
        self.accountNo = accountNo
        self.branchName = branchName
        self.ifscCode = ifscCode

    def getCode(self):
        return self.code

    def getName(self):
        return self.name

    def getAddress(self):
        return self.address

    def getGstNum(self):
        return self.gstNum

    def getRegTitle1(self):
        return self.regTitle1

    def getRegValue1(self):
        return self.regValue1

    def getContact1(self):
        return self.contact1

    def getContact2(self):
        return self.contact2

    def getStateCode(self):
        return self.stateCode

    def getBankName(self):
        return self.bankName

    def getAccountNo(self):
        return self.accountNo

    def getBranchName(self):
        return self.branchName

    def getIfscCode(self):
        return self.ifscCode


class Customer:
    def __init__(self, code, name, address, regTitle1, regValue1, regTitle2, regValue2, regTitle3, regValue3, contact1, contact2, contact3, stateCode):
        self.code = code
        self.name = name
        self.address = address
        self.regTitle1 = regTitle1
        self.regValue1 = regValue1
        self.regTitle2 = regTitle2
        self.regValue2 = regValue2
        self.regTitle3 = regTitle3
        self.regValue3 = regValue3
        self.contact1 = contact1
        self.contact2 = contact2
        self.contact3 = contact3
        self.stateCode = stateCode

    def getCode(self):
        return self.code

    def getName(self):
        return self.name

    def getAddress(self):
        return self.address

    def getRegTitle1(self):
        return self.regTitle1

    def getRegValue1(self):
        return self.regValue1

    def getRegTitle2(self):
        return self.regTitle2

    def getRegValue2(self):
        return self.regValue2

    def getRegTitle3(self):
        return self.regTitle3

    def getRegValue3(self):
        return self.regValue3

    def getContact1(self):
        return self.contact1

    def getContact2(self):
        return self.contact2

    def getContact3(self):
        return self.contact3

    def getStateCode(self):
        return self.stateCode


class BankDetails:
    def __init__(self, code, traderCode, customerCode, bankName, accountNo, ifscCode):
        self.code = code
        self.traderCode = traderCode
        self.customerCode = customerCode
        self.bankName = bankName
        self.accountNo = accountNo
        self.ifscCode = ifscCode

    def getCode(self):
        return self.code

    def getTraderCode(self):
        return self.traderCode

    def getCustomerCode(self):
        return self.customerCode

    def getBankName(self):
        return self.bankName

    def getAccountNo(self):
        return self.accountNo

    def getIFSCCode(self):
        return self.ifscCode
    
class Invoice:
    def __init__(self, customerCode, invoiceDate, totalAmount=0.0, createdOn=None, code=None):
        self.code = code
        self.customerCode = customerCode
        self.invoiceDate = invoiceDate
        self.totalAmount = totalAmount
        self.createdOn = createdOn

    def getCode(self):
        return self.code

    def getCustomerCode(self):
        return self.customerCode

    def getInvoiceDate(self):
        return self.invoiceDate

    def getTotalAmount(self):
        return self.totalAmount

    def getCreatedOn(self):
        return self.createdOn


class InvoiceItem:
    def __init__(self, invoiceCode, itemCode, rate, quantity, sgst, cgst, igst, taxableAmount, totalAmount):
        self.invoiceCode = invoiceCode
        self.itemCode = itemCode
        self.rate = rate
        self.quantity = quantity
        self.sgst = sgst
        self.cgst = cgst
        self.igst = igst
        self.taxableAmount = taxableAmount
        self.totalAmount = totalAmount

    def getInvoiceCode(self):
        return self.invoiceCode

    def getItemCode(self):
        return self.itemCode

    def getRate(self):
        return self.rate

    def getQuantity(self):
        return self.quantity

    def getSgst(self):
        return self.sgst

    def getIgst(self):
        return self.igst

    def getCgst(self):
        return self.cgst

    def getTaxableAmount(self):
        return self.taxableAmount

    def getTotalAmount(self):
        return self.totalAmount
    
class User:
    def __init__(self, id=None, name=None, email=None, password=None, role=None, createdAt=None):
        self.id = id
        self.name = name
        self.email = email
        self.password = password
        self.role = role
        self.createdAt = createdAt
    def getId(self):
        return self.id
    def getName(self):
        return self.name
    def getEmail(self):
        return self.email
    def getPassword(self):
        return self.password
    def getRole(self):
        return self.role
    def getCreatedAt(self):
        return self.createdAt
    def __str__(self):
        return f"User(id={self.id}, name='{self.name}', email='{self.email}', role='{self.role}')"



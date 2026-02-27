import cx_Oracle as oracle
import bcrypt
import base64
from datetime import date  # agar already import nahi hai to upar



from datalayer.exceptions import DataLayerException
from datalayer.connector import DBConnection
from datalayer.entities import Invoice, UnitofMeasurement

from datalayer.entities import Item,State
from datalayer.entities import Traders
from datalayer.entities import Customer
from datalayer.entities import InvoiceItem,User


class UnitofMeasurmentManager:
    def __init__(self):
        pass

    def add(self,UnitOfMeasurement):
        if UnitOfMeasurement is None:raise DataLayerException("UnitofMeasurment required")
        if not UnitOfMeasurement.name or len(UnitOfMeasurement.name.strip()) == 0:raise DataLayerException("Name required")
        if len(UnitOfMeasurement.name) > 5:raise DataLayerException("Name cannot exceed 5 characters")
    #Connection
        connection = DBConnection.getConnection()
        try:
            cursor = connection.cursor()
    # Check duplicate
            cursor.execute( f"select name from ac_uom where lower(name)=lower('{UnitOfMeasurement.name}')")
            row = cursor.fetchone()
            if row:raise DataLayerException(f"{UnitOfMeasurement.name} exists")
            cursor.execute(f"insert into ac_uom (name) values('{UnitOfMeasurement.name}')")
            connection.commit()
    # Fetch generated code
            cursor.execute(f"select code from ac_uom where lower(name)=lower('{UnitOfMeasurement.name}')")
            row = cursor.fetchone()
            if row:
                UnitOfMeasurement.code = row[0]
            else:
                raise DataLayerException("Failed to retrieve generated code")
        except Exception as ex:
            raise DataLayerException(str(ex))
        finally:
            try:
                cursor.close()
                connection.close()
            except:
                pass

    def update(self, UnitOfMeasurement):
        if UnitOfMeasurement.code is None:raise DataLayerException("Code required")
        if UnitOfMeasurement.code <= 0:raise DataLayerException("Invalid code")
        if not UnitOfMeasurement.name or len(UnitOfMeasurement.name.strip()) == 0:raise DataLayerException("Name required")
        if len(UnitOfMeasurement.name.strip()) > 5:raise DataLayerException("Name cannot exceed 5 characters")
        connection = DBConnection.getConnection()
        try:
            cursor = connection.cursor()
            cursor.execute(f"SELECT code FROM ac_uom WHERE code = {UnitOfMeasurement.code}")
            row = cursor.fetchone()
            if not row:raise DataLayerException(f"Invalid code: {UnitOfMeasurement.code}")
    # Check for duplicate name with different code
            cursor.execute(f"SELECT code FROM ac_uom WHERE LOWER(name) = LOWER('{UnitOfMeasurement.name}') AND code <> {UnitOfMeasurement.code}")
            row = cursor.fetchone()
            if row:raise DataLayerException(f"{UnitOfMeasurement.name} already exists")
    # Perform update
            cursor.execute(f"UPDATE ac_uom SET name = '{UnitOfMeasurement.name}' WHERE code = {UnitOfMeasurement.code}")
            connection.commit()
        except Exception as ee:
            raise DataLayerException(str(ee))
        finally:
            try:
                cursor.close()
                connection.close()
            except:
                pass

    def remove(self, code):
        if code is None:raise DataLayerException("Code required")
        if code <= 0:raise DataLayerException("Invalid code")
        connection = DBConnection.getConnection()
        try:
            cursor = connection.cursor()
        # Check if code exists
            cursor.execute(f"SELECT code FROM ac_uom WHERE code = {code}")
            row = cursor.fetchone()
            if not row:
                raise DataLayerException(f"Invalid code: {code}")
            cursor.execute(f"SELECT uom_code FROM ac_item_uom WHERE uom_code = {code}")
            row = cursor.fetchone()
            if row:raise DataLayerException(f"Unit of Measurement with code {code} has been allotted to an item")
            cursor.execute(f"DELETE FROM ac_uom WHERE code = {code}")
            connection.commit()
        except Exception as ex:
            raise DataLayerException(str(ex))
        finally:
            try:
                cursor.close()
                connection.close()
            except:
                pass


    def getAll(self):
        unitofMeasurments = []
        connection = DBConnection.getConnection()
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT code, name FROM ac_uom ORDER BY name")
            rows = cursor.fetchall()
            for row in rows:
                uom =UnitofMeasurement(code=int(row[0]),name=row[1].strip())
                unitofMeasurments.append(uom)
        except Exception as ex:
            raise DataLayerException(str(ex))
        finally:
            try:
                cursor.close()
                connection.close()
            except:
                pass
        return unitofMeasurments
    def getByCode(self, code):
        if code is None:raise DataLayerException("Code required")
        if code <= 0:raise DataLayerException("Invalid code")
        connection = DBConnection.getConnection()
        try:
            cursor = connection.cursor()
            cursor.execute(f"SELECT code, name FROM ac_uom WHERE code = {code}")
            row = cursor.fetchone()
            if not row:raise DataLayerException(f"Invalid code: {code}")
            uom = UnitofMeasurement(code=int(row[0]),name=row[1].strip())
            return uom
        except Exception as ex:
            raise DataLayerException(str(ex))
        finally:
            try:
                cursor.close()
                connection.close()
            except:
                pass


    def getByName(self, name):
        if not name:raise DataLayerException("Name required")
        if len(name) <= 0 or len(name) > 5:raise DataLayerException("Invalid name length")
        connection = DBConnection.getConnection()
        try:
            cursor = connection.cursor()
            cursor.execute(f"SELECT code, name FROM ac_uom WHERE lower(name) = lower('{name}')")
            row = cursor.fetchone()
            if not row:raise DataLayerException(f"Invalid name: {name}")
            uom = UnitofMeasurement(code=int(row[0]),name=row[1].strip())
            return uom
        except Exception as ex:
            raise DataLayerException(str(ex))
        finally:
            try:
                cursor.close()
                connection.close()
            except:
                pass

class ItemManager:
    def __init__(self):
        pass
    def add(self, item):
        if not item.name or len(item.name.strip()) == 0:raise DataLayerException("Item name required")
        if len(item.name) > 25:raise DataLayerException("Name cannot exceed 25 characters")
        if not item.hsnCode or len(item.hsnCode) < 4 or len(item.hsnCode) > 10:raise DataLayerException("HSN Code must be between 4 to 10 characters")

        if item.cgst is None:
            item.cgst = 0
        if item.cgst < 0:raise DataLayerException("CGST cannot be negative")
        if item.sgst is None:item.sgst = 0
        if item.sgst < 0:raise DataLayerException("SGST cannot be negative")
        if item.igst is None:item.igst = 0
        if item.igst < 0:raise DataLayerException("IGST cannot be negative")
        connection = DBConnection.getConnection()
        if not connection:raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            cursor.execute("""SELECT code FROM ac_item WHERE LOWER(name) = LOWER(:name)""",{"name": item.name})
            existing = cursor.fetchone()
            if existing:raise DataLayerException(f"Error: Item '{item.name}' already exists with code {existing[0]}")
            code_var = cursor.var(oracle.NUMBER)
            cursor.execute("""INSERT INTO ac_item (name, hsn_code)VALUES (:name, :hsn_code) RETURNING code INTO :code""",
            {
                "name": item.name,
                "hsn_code": item.hsnCode,
                "code": code_var
            }
        )
            connection.commit()
            item_code = code_var.getvalue()[0]
            if not item_code:raise DataLayerException("Error: Inserted item code not retrieved.")
            item.code = int(item_code)
            cursor.execute(
            """
            INSERT INTO ac_item_tax (item_code, cgst, sgst, igst)
            VALUES (:code, :cgst, :sgst, :igst)
            """,
            {
                "code": item.code,
                "cgst": item.cgst,
                "sgst": item.sgst,
                "igst": item.igst
            }
        )
            connection.commit()
            print("Tax Inserted Successfully")

        # Insert unit measurements if any
            if item.unitofMeasurments:
                print("Inserting Unit of Measurements...")
                for uom in item.unitofMeasurments:
                    cursor.execute(
                    """
                     INSERT INTO ac_item_uom (item_code, uom_code)
                    VALUES (:item_code, :unit_code)
                    """,
                    {
                       "item_code": item.code,
                        "unit_code": uom.code
                    }
                )
                connection.commit()
        except oracle.DatabaseError as db_err:
            connection.rollback()
            print(" Database Error:", db_err)
            raise DataLayerException(f"Database error: {db_err}")
        finally:
            cursor.close()
            connection.close()

    def update(self, item):
        if not item.code:raise DataLayerException("Item code is required for update")
        if not item.name or len(item.name.strip()) == 0:raise DataLayerException("Item name required")
        if len(item.name) > 25:raise DataLayerException("Name cannot exceed 25 characters")
        if not item.hsnCode or len(item.hsnCode) < 4 or len(item.hsnCode) > 10:raise DataLayerException("HSN Code must be between 4 to 10 characters")
        if item.cgst is None:item.cgst = 0
        if item.cgst < 0:raise DataLayerException("CGST cannot be negative")
        if item.sgst is None:item.sgst = 0
        if item.sgst < 0:raise DataLayerException("SGST cannot be negative")
        if item.igst is None:item.igst = 0
        if item.igst < 0:raise DataLayerException("IGST cannot be negative")

    # Connection
        connection = DBConnection.getConnection()
        if not connection:raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()

        # Check if item exists
            cursor.execute(
            """
            SELECT code FROM ac_item WHERE code = :code
            """,
            {"code": item.code}
        )
            row = cursor.fetchone()
            if not row:raise DataLayerException(f"Item with code {item.code} not found")
        # Update ac_item
            print(" Updating ac_item...")
            cursor.execute(
            """
            UPDATE ac_item 
            SET name = :name, hsn_code = :hsnCode
            WHERE code = :code
            """,
            {
                "name": item.name,
                "hsnCode": item.hsnCode,
                "code": item.code
            }
        )

            cursor.execute(
            """
            UPDATE ac_item_tax 
            SET cgst = :cgst, sgst = :sgst, igst = :igst
            WHERE item_code = :code
            """,
            {
                "cgst": item.cgst,
                "sgst": item.sgst,
                "igst": item.igst,
                "code": item.code
            }
        )

            print("Updating Unit of Measurements...")
            cursor.execute(
            """
            DELETE FROM ac_item_uom
            WHERE item_code = :code
            """,
            {"code": item.code}
        )
        # Re-insert if any
            if item.unitofMeasurments:
                for uom in item.unitofMeasurments:
                    cursor.execute(
                    """
                    INSERT INTO ac_item_uom (item_code, uom_code)
                    VALUES (:item_code, :uom_code)
                    """,
                    {
                        "item_code": item.code,
                        "uom_code": uom.code
                    }
                )

            connection.commit()

        except Exception as e:
            connection.rollback()
            print(" Database Error:", e)
            raise DataLayerException(str(e))

        finally:
            cursor.close()
            connection.close()
            
    def remove(self, code):
        if not code:raise DataLayerException("Code required")
        if code <= 0:raise DataLayerException("Invalid code")
        connection = DBConnection.getConnection()
        if not connection:raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            cursor.execute(f"SELECT code FROM ac_item WHERE code = {code}")
            if not cursor.fetchone():raise DataLayerException(f"Invalid code: {code}")
            cursor.execute(f"DELETE FROM ac_item_uom WHERE item_code = {code}")
            connection.commit()
            cursor.execute(f"DELETE FROM ac_item_tax WHERE item_code = {code}")
            connection.commit()
            cursor.execute(f"DELETE FROM ac_item WHERE code = {code}")
            connection.commit()
            print("Item removed successfully")
        except Exception as e:
            connection.rollback()
            print("Database Error:", e)
            raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()

    

    def getAll(self):
        connection = DBConnection.getConnection()
        if not connection:raise DataLayerException("Unable to connect to database")
        items = []
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT code, name, hsn_code FROM ac_item ORDER BY name")
            rows = cursor.fetchall()
            for row in rows:
                code = int(row[0])
                name = row[1].strip()
                hsnCode = row[2].strip() if row[2] else ""
                item = Item(
                    code=code,
                    name=name,
                    hsnCode=hsnCode,
                    cgst=0,
                    sgst=0,
                    igst=0,
                    unitofMeasurments=[]
                )
                cursor.execute(f"SELECT cgst, sgst, igst FROM ac_item_tax WHERE item_code = {code}")
                taxRow = cursor.fetchone()
                if taxRow:
                    item.cgst = float(taxRow[0])
                    item.sgst = float(taxRow[1])
                    item.igst = float(taxRow[2])
                else:
                    item.cgst = 0
                    item.sgst = 0
                    item.igst = 0
                cursor.execute(
                    f"""
                    SELECT uom.code, uom.name 
                    FROM ac_item_uom iu 
                    INNER JOIN ac_uom uom ON iu.uom_code = uom.code 
                    WHERE iu.item_code = {code}
                    """
                )
                uomRows = cursor.fetchall()
                uoms = []
                for uomRow in uomRows:
                    uoms.append(UnitofMeasurement(int(uomRow[0]), uomRow[1].strip()))
                item.unitofMeasurments = uoms
                items.append(item)
            print(" All items fetched successfully")

            return items

        except Exception as e:
            print("Database Error:", e)
            raise DataLayerException(str(e))

        finally:
            cursor.close()
            connection.close()

    def getByCode(self, code):
        if not code or code <= 0:
            raise DataLayerException("Invalid code")

        connection = DBConnection.getConnection()
        if not connection:
            raise DataLayerException("Unable to connect to database")

        try:
            cursor = connection.cursor()

            # ✅ Fetch item basic details
            cursor.execute(
                f"SELECT code, name, hsn_code FROM ac_item WHERE code = {code}"
            )
            row = cursor.fetchone()
            if not row:
                raise DataLayerException(f"Item not found with code: {code}")

            item = Item(
                code=int(row[0]),
                name=row[1].strip(),
                hsnCode=row[2].strip() if row[2] else "",
                cgst=0,
                sgst=0,
                igst=0,
                unitofMeasurments=[]
            )

            # ✅ Fetch tax details
            cursor.execute(
                f"SELECT cgst, sgst, igst FROM ac_item_tax WHERE item_code = {code}"
            )
            tax_row = cursor.fetchone()
            if tax_row:
                item.cgst = float(tax_row[0])
                item.sgst = float(tax_row[1])
                item.igst = float(tax_row[2])

            # ✅ Fetch Unit of Measurements
            cursor.execute(
                f"""
                SELECT uom.code, uom.name
                FROM ac_item_uom iu
                INNER JOIN ac_uom uom ON iu.uom_code = uom.code
                WHERE iu.item_code = {code}
                """
            )
            uom_rows = cursor.fetchall()
            uoms = [UnitofMeasurement(int(u[0]), u[1].strip()) for u in uom_rows]
            item.unitofMeasurments = uoms
            return item
        except Exception as e:
            print(" Database Error:", e)
            raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()

class StateManager:
    def __init__(self):
        pass
    def getAll(self):
        connection = DBConnection.getConnection()
        if not connection:raise DataLayerException("Unable to connect to database")
        states = []
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT code, name, alpha_code FROM ac_state ORDER BY name")
            rows = cursor.fetchall()
            for row in rows:
                state = State(
                    code=int(row[0]),
                    name=row[1].strip(),
                    alphaCode=row[2].strip()
                )
                states.append(state)
        except Exception as e:
            print(" Database Error:", e)
            raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()
        return states

    def getByCode(self, code):
        if not code or code <= 0:raise DataLayerException("Invalid state code")
        connection = DBConnection.getConnection()
        if not connection:raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT code, name, alpha_code FROM ac_state WHERE code = :code",{"code": code})
            row = cursor.fetchone()
            if not row:raise DataLayerException(f"State with code {code} not found")
            state = State(
                code=int(row[0]),
                name=row[1].strip(),
                alphaCode=row[2].strip()
            )
        except Exception as e:
            print(" Database Error:", e)
            raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()
        return state

    def getByAlphaCode(self, alphaCode):
        if not alphaCode or len(alphaCode) != 2:raise DataLayerException("Invalid Alpha Code")
        connection = DBConnection.getConnection()
        if not connection:raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT code, name, alpha_code 
                FROM ac_state 
                WHERE LOWER(alpha_code) = LOWER(:alpha)
                """,
                {"alpha": alphaCode}
            )
            row = cursor.fetchone()
            if not row:raise DataLayerException(f"State with Alpha Code '{alphaCode}' not found")
            state = State(
                code=int(row[0]),
                name=row[1].strip(),
                alphaCode=row[2].strip()
            )
        except Exception as e:
            print(" Database Error:", e)
            raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()
        return state
    

class TraderManager:
    def __init__(self):
        pass

    def getAll(self):
        connection = DBConnection.getConnection()
        if not connection:raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            query = """
                SELECT CODE, NAME, ADDRESS, GST_NUM, REG_TITLE_1, REG_VALUE_1,
                       CONTACT_1, CONTACT_2, STATE_CODE, BANK_NAME, ACCOUNT_NO, BRANCH_NAME, IFSC_CODE
                FROM ac_trader FETCH FIRST 1 ROW ONLY
            """
            cursor.execute(query)
            row = cursor.fetchone()
            if not row:
                return None  # No record found
            trader = Traders(
                    code=int(row[0]),
                    name=row[1].strip() if row[1] is not None else None,
                    address=row[2].strip() if row[2] is not None else None,
                    gstNum=row[3].strip() if row[3] is not None else None,
                    regTitle1=row[4].strip() if row[4] is not None else None,
                    regValue1=row[5].strip() if row[5] is not None else None,
                    contact1=row[6].strip() if row[6] is not None else None,
                    contact2=row[7].strip() if row[7] is not None else None,
                    stateCode=int(row[8]),
                    bankName=row[9].strip() if row[9] is not None else None,
                    accountNo=row[10].strip() if row[10] is not None else None,
                    branchName=row[11].strip() if row[11] is not None else None,
                    ifscCode=row[12].strip() if row[12] is not None else None
                )
            return trader
        except Exception as e:
            raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()

    def update(self, trader):
        if not trader or not trader.code or not trader.name or not trader.address or not trader.gstNum or not trader.stateCode:
            raise DataLayerException("Missing required trader details")
        connection = DBConnection.getConnection()
        if not connection:raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            # Check if record exists
            cursor.execute("SELECT COUNT(*) FROM ac_trader")
            count = cursor.fetchone()[0]
            record_exists = count > 0
            if record_exists:
                cursor.execute("""
                    UPDATE ac_trader SET 
                        name = :name,
                        address = :address,
                        gst_num = :gstNum,
                        reg_title_1 = :regTitle1,
                        reg_value_1 = :regValue1,
                        contact_1 = :contact1,
                        contact_2 = :contact2,
                        state_code = :stateCode,
                        bank_name = :bankName,
                        account_no = :accountNo,
                        branch_name = :branchName,
                        ifsc_code = :ifscCode
                    WHERE code = :code
                """, {
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
                })
            else:
                cursor.execute("""
                    INSERT INTO ac_trader (
                        code, name, address, gst_num, reg_title_1, reg_value_1,
                        contact_1, contact_2, state_code,
                        bank_name, account_no, branch_name, ifsc_code
                    ) VALUES (
                        :code, :name, :address, :gstNum, :regTitle1, :regValue1,
                        :contact1, :contact2, :stateCode,
                        :bankName, :accountNo, :branchName, :ifscCode
                    )
                """, {
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
                })

            connection.commit()
        except Exception as e:
            connection.rollback()
            raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()

class  CustomerManager:
    def __init__(self):
        pass
    def hasInvoices(self, customer_code):
        connection = DBConnection.getConnection()
        cursor = connection.cursor()
        cursor.execute(
            "SELECT COUNT(*) FROM ac_invoice WHERE customer_code = :code",
        {"code": customer_code}
        )
        count = cursor.fetchone()[0]
        cursor.close()
        connection.close()
        return count > 0
    def add(self, customer):
        connection = DBConnection.getConnection()
        if connection is None:raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            code_var = cursor.var(int)
            cursor.execute(
            """
            INSERT INTO ac_customer (
                CODE, NAME, ADDRESS, REG_TITLE_1, REG_VALUE_1,
                REG_TITLE_2, REG_VALUE_2, REG_TITLE_3, REG_VALUE_3,
                CONTACT_1, CONTACT_2, CONTACT_3, STATE_CODE
            )
            VALUES (
                AC_CUSTOMER_SEQ.NEXTVAL, :name, :address, :regTitle1, :regValue1,
                :regTitle2, :regValue2, :regTitle3, :regValue3,
                :contact1, :contact2, :contact3, :stateCode
            )
            RETURNING CODE INTO :code
            """,
            {
                "name": customer.name,
                "address": customer.address,
                "regTitle1": customer.regTitle1,
                "regValue1": customer.regValue1,
                "regTitle2": customer.regTitle2,
                "regValue2": customer.regValue2,
                "regTitle3": customer.regTitle3,
                "regValue3": customer.regValue3,
                "contact1": customer.contact1,
                "contact2": customer.contact2,
                "contact3": customer.contact3,
                "stateCode": customer.stateCode,
                "code": code_var
            }
        )
            connection.commit()
            customer.code = code_var.getvalue()
            return customer.code
        except Exception as e:
            connection.rollback()
            raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()

    def update(self, customer):
        if not customer or not customer.get("code"):
            raise DataLayerException("Customer code is required for update")

        connection = DBConnection.getConnection()
        if connection is None:
            raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            cursor.execute(
                """
                UPDATE ac_customer SET
                    NAME = :name,
                    ADDRESS = :address,
                    REG_TITLE_1 = :regTitle1,
                    REG_VALUE_1 = :regValue1,
                    REG_TITLE_2 = :regTitle2,
                    REG_VALUE_2 = :regValue2,
                    REG_TITLE_3 = :regTitle3,
                    REG_VALUE_3 = :regValue3,
                    CONTACT_1 = :contact1,
                    CONTACT_2 = :contact2,
                    CONTACT_3 = :contact3,
                    STATE_CODE = :stateCode
                WHERE CODE = :code
                """,
                {
                    "code": customer["code"],
                    "name": customer["name"],
                    "address": customer["address"],
                    "regTitle1": customer.get("regTitle1"),
                    "regValue1": customer.get("regValue1"),
                    "regTitle2": customer.get("regTitle2"),
                    "regValue2": customer.get("regValue2"),
                    "regTitle3": customer.get("regTitle3"),
                    "regValue3": customer.get("regValue3"),
                    "contact1": customer.get("contact1"),
                    "contact2": customer.get("contact2"),
                    "contact3": customer.get("contact3"),
                    "stateCode": customer.get("stateCode", 1)
                }
            )
            if cursor.rowcount == 0:
                raise DataLayerException(f"No customer found with code {customer['code']}")
            connection.commit()
            return {"success": True, "message": "Customer updated successfully"}
        except Exception as e:
            connection.rollback()
            raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()

    def getByCode(self, code):
        if not code or code <= 0:raise DataLayerException("Invalid customer code")
        connection = DBConnection.getConnection()
        if connection is None:raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT CODE, NAME, ADDRESS, REG_TITLE_1, REG_VALUE_1,
                       REG_TITLE_2, REG_VALUE_2, REG_TITLE_3, REG_VALUE_3,
                       CONTACT_1, CONTACT_2, CONTACT_3, STATE_CODE
                FROM ac_customer
                WHERE CODE = :code
                """,
                {"code": code}
            )
            row = cursor.fetchone()
            if not row:
                return None
            return {
                "code": row[0],
                "name": row[1].strip() if row[1] else None,
                "address": row[2].strip() if row[2] else None,
                "regTitle1": row[3].strip() if row[3] else None,
                "regValue1": row[4].strip() if row[4] else None,
                "regTitle2": row[5].strip() if row[5] else None,
                "regValue2": row[6].strip() if row[6] else None,
                "regTitle3": row[7].strip() if row[7] else None,
                "regValue3": row[8].strip() if row[8] else None,
                "contact1": row[9].strip() if row[9] else None,
                "contact2": row[10].strip() if row[10] else None,
                "contact3": row[11].strip() if row[11] else None,
                "stateCode": row[12]
            }
        except Exception as e:
            raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()
            
    def remove(self, code):
        if not code or code <= 0:
            raise DataLayerException("Invalid customer code")

        if self.hasInvoices(code):
            raise DataLayerException("Cannot delete customer with existing invoices")

        connection = DBConnection.getConnection()
        if connection is None:
            raise DataLayerException("Unable to connect to database")

        cursor = None
        try:
            cursor = connection.cursor()
            cursor.execute(
            "DELETE FROM ac_customer WHERE CODE = :code",
            {"code": code}
        )
            if cursor.rowcount == 0:
                raise DataLayerException(f"No customer found with code {code}")

            connection.commit()
            return {"success": True, "message": "Customer removed successfully"}

        except Exception as e:
            connection.rollback()
            raise DataLayerException(str(e))
        finally:
            if cursor:
                cursor.close()
            connection.close()

    
    def getAll(self):
        connection = DBConnection.getConnection()
        if connection is None:raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            cursor.execute(
                """
                SELECT CODE, NAME, ADDRESS, REG_TITLE_1, REG_VALUE_1,
                       REG_TITLE_2, REG_VALUE_2, REG_TITLE_3, REG_VALUE_3,
                       CONTACT_1, CONTACT_2, CONTACT_3, STATE_CODE
                FROM ac_customer
                ORDER BY NAME
                """
            )
            rows = cursor.fetchall()
            customers = []
            for row in rows:
                customers.append({
                    "code": row[0],
                    "name": row[1].strip() if row[1] else None,
                    "address": row[2].strip() if row[2] else None,
                    "regTitle1": row[3].strip() if row[3] else None,
                    "regValue1": row[4].strip() if row[4] else None,
                    "regTitle2": row[5].strip() if row[5] else None,
                    "regValue2": row[6].strip() if row[6] else None,
                    "regTitle3": row[7].strip() if row[7] else None,
                    "regValue3": row[8].strip() if row[8] else None,
                    "contact1": row[9].strip() if row[9] else None,
                    "contact2": row[10].strip() if row[10] else None,
                    "contact3": row[11].strip() if row[11] else None,
                    "stateCode": row[12]
                })
            return customers
        except Exception as e:
            raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()

class InvoiceManager:
    def __init__(self):
        pass
    
    def add(self, invoice):
        connection = DBConnection.getConnection()
        if connection is None:
            raise DataLayerException("Unable to connect to database")

        try:
            cursor = connection.cursor()

            code_var = cursor.var(int)

        # Insert invoice
            cursor.execute("""
            INSERT INTO ac_invoice (
                code,
                customer_code,
                invoice_date,
                total_amount,
                created_on
            )
            VALUES (
                SEQ_INVOICE_CODE.NEXTVAL,
                :customerCode,
                :invoiceDate,
                :totalAmount,
                :createdOn
            )
            RETURNING code INTO :code
        """, {
            "customerCode": invoice.customerCode,
            "invoiceDate": invoice.invoiceDate,
            "totalAmount": invoice.totalAmount,
            "createdOn": invoice.createdOn,
            "code": code_var
        })

            invoiceCode = code_var.getvalue()[0]

        
            for item in invoice.items:
                cursor.execute("""
                INSERT INTO ac_invoice_item (
                    invoice_code,
                    item_code,
                    rate,
                    quantity,
                    sgst,
                    cgst,
                    igst,
                    taxable_amount,
                    total_amount
                )
                VALUES (
                    :invoiceCode,
                    :itemCode,
                    :rate,
                    :quantity,
                    :sgst,
                    :cgst,
                    :igst,
                    :taxableAmount,
                    :totalAmount
                )
            """, {
                "invoiceCode": invoiceCode,
                "itemCode": item.itemCode,
                "rate": item.rate,
                "quantity": item.quantity,
                "sgst": item.sgst,
                "cgst": item.cgst,
                "igst": item.igst,
                "taxableAmount": item.taxableAmount,
                "totalAmount": item.totalAmount
            })

            connection.commit()
            return invoiceCode

        except Exception as e:
            connection.rollback()
            raise DataLayerException(str(e))

        finally:
            cursor.close()
            connection.close()
            
    def getAll(self):
        connection = DBConnection.getConnection()
        if connection is None:
            raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            cursor.execute("""
            SELECT
                i.code,
                i.invoice_date,
                i.created_on,
                c.name AS customer_name,
                NVL(SUM(ii.total_amount), 0) AS total_amount
            FROM ac_invoice i
            JOIN ac_customer c ON i.customer_code = c.code
            LEFT JOIN ac_invoice_item ii ON i.code = ii.invoice_code
            GROUP BY i.code, i.invoice_date, i.created_on, c.name
            ORDER BY i.invoice_date DESC
        """)
            rows = cursor.fetchall()
            invoices = []
            for row in rows:
                invoice = {
                "code": row[0],
                "invoiceDate": row[1].strftime("%Y-%m-%d") if row[1] else "Unknown",
                "createdOn": row[2].strftime("%Y-%m-%d") if row[2] else "Not Created",
                "customerName": row[3].strip() if row[3] else "Unknown",
                "totalAmount": float(row[4])
            }
                invoices.append(invoice)
            return invoices
        except Exception as e:
            raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()

    def getInvoiceDetails(self, invoiceCode):
        connection = DBConnection.getConnection()
        if connection is None:raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            cursor.execute(
            """
            SELECT
                code,
                customer_code,
                invoice_date,
                total_amount,
                created_on
            FROM
                ac_invoice
            WHERE
                code = :code
            """,
            {"code": invoiceCode}
        )
            invoice_row = cursor.fetchone()
            if not invoice_row:raise DataLayerException(f"Invoice with code {invoiceCode} not found")
            invoice = Invoice(
            code=invoice_row[0],
            customerCode=invoice_row[1],
            invoiceDate=invoice_row[2],
            totalAmount=invoice_row[3],
            createdOn=invoice_row[4]
        )
        # Get invoice items
            cursor.execute(
            """
            SELECT
                invoice_code,
                item_code,
                rate,
                quantity,
                sgst,
                cgst,
                igst,
                taxable_amount,
                total_amount
            FROM
                ac_invoice_item
            WHERE
                invoice_code = :code
            """,
            {"code": invoiceCode}
        )

            items = []
            for row in cursor.fetchall():
                item = InvoiceItem(
                invoiceCode=row[0],
                itemCode=row[1],
                rate=row[2],
                quantity=row[3],
                sgst=row[4],
                cgst=row[5],
                igst=row[6],
                taxableAmount=row[7],
                totalAmount=row[8]
            )
                items.append(item)

            return invoice, items
        except Exception as e:
            raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()

class InvoiceItemManager:
    def __init__(self):
        pass

    def add(self, invoiceItem):
        connection = DBConnection.getConnection()
        if connection is None:raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            cursor.execute(
                """
                INSERT INTO ac_invoice_item (
                    invoice_code,
                    item_code,
                    rate,
                    quantity,
                    sgst,
                    cgst,
                    igst,
                    taxable_amount,
                    total_amount
                )
                VALUES (
                    :invoiceCode,
                    :itemCode,
                    :rate,
                    :quantity,
                    :sgst,
                    :cgst,
                    :igst,
                    :taxableAmount,
                    :totalAmount
                )
                """,
                {
                    "invoiceCode": invoiceItem.invoiceCode,
                    "itemCode": invoiceItem.itemCode,
                    "rate": invoiceItem.rate,
                    "quantity": invoiceItem.quantity,
                    "sgst": invoiceItem.sgst,
                    "cgst": invoiceItem.cgst,
                    "igst": invoiceItem.igst,
                    "taxableAmount": invoiceItem.taxableAmount,
                    "totalAmount": invoiceItem.totalAmount
                }
            )
            connection.commit()
        except Exception as e:
            connection.rollback()
            raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()

    def getByInvoiceCode(self, invoiceCode):
        connection = DBConnection.getConnection()
        if connection is None:raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            cursor.execute("""
                SELECT invoice_code, item_code, rate, quantity, sgst, cgst, igst, taxable_amount, total_amount
                FROM ac_invoice_item
                WHERE invoice_code = :invoiceCode
            """, {"invoiceCode": invoiceCode})

            rows = cursor.fetchall()
            from datalayer.entities import InvoiceItem
            items = []
            for row in rows:
                item = InvoiceItem(
                    invoiceCode=row[0],
                    itemCode=row[1],
                    rate=row[2],
                    quantity=row[3],
                    sgst=row[4],
                    cgst=row[5],
                    igst=row[6],
                    taxableAmount=row[7],
                    totalAmount=row[8]
                )
                items.append(item)
            return items
        except Exception as e:
            raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()



class UserManager:
    def __init__(self):
        pass

    def add(self, user):
        connection = DBConnection.getConnection()
        if connection is None:raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            hashed_bytes = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())
            hashed_password = base64.b64encode(hashed_bytes).decode()
            cursor.execute("""
                INSERT INTO users (name, email, password, role, created_at)
                VALUES (:name, :email, :password, :role, SYSDATE)
            """, {
                "name": user.name,
                "email": user.email,
                "password": hashed_password,
                "role": user.role
            })
            connection.commit()
        except Exception as e:
            connection.rollback()
            raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()

    def getByEmail(self, email):
        connection = DBConnection.getConnection()
        if connection is None:raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            cursor.execute("""
                SELECT id, name, email, password, role, created_at
                FROM users
                WHERE email = :email
            """, {"email": email})
            row = cursor.fetchone()
            if not row:
                return None
            user = User(
                id=row[0],
                name=row[1],
                email=row[2],
                password=row[3],
                role=row[4],
                createdAt=row[5]
            )
            return user
        except Exception as e:
            raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()

    def getAll(self):
        connection = DBConnection.getConnection()
        if connection is None:raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            cursor.execute("""
                SELECT id, name, email, role, created_at
                FROM users
                ORDER BY created_at DESC
            """)
            users = []
            for row in cursor.fetchall():
                user = {
                    "id": row[0],
                    "name": row[1],
                    "email": row[2],
                    "role": row[3],
                    "createdAt": row[4].strftime("%Y-%m-%d") if row[4] else None
                }
                users.append(user)
            return users
        except Exception as e:raise DataLayerException(str(e))
        finally:
            cursor.close()
            connection.close()

    def validate_password(self, plain_password, hashed_password):
        try:
            hashed_bytes = base64.b64decode(hashed_password.encode())
            return bcrypt.checkpw(plain_password.encode(), hashed_bytes)
        except Exception as e:raise DataLayerException("Password validation failed: " + str(e))

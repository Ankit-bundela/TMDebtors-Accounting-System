
from mysql.connector import connect, Error
import bcrypt

from datetime import datetime
from datalayer.exceptions import DataLayerException
from datalayer.connector import DBConnection
from datalayer.entities import Invoice, UnitofMeasurement
from datalayer.entities import Item, State
from datalayer.entities import Traders
from datalayer.entities import Customer
from datalayer.entities import InvoiceItem, User


class UnitofMeasurmentManager:
    def __init__(self):
        pass

    def add(self, UnitOfMeasurement):
        if UnitOfMeasurement is None:
            raise DataLayerException("UnitofMeasurment required")
        if not UnitOfMeasurement.name or len(UnitOfMeasurement.name.strip()) == 0:
            raise DataLayerException("Name required")
        if len(UnitOfMeasurement.name) > 5:
            raise DataLayerException("Name cannot exceed 5 characters")
    # Connection
        connection = DBConnection.getConnection()
        try:
            cursor = connection.cursor()
    # Check duplicate
            cursor.execute(
                f"select name from ac_uom where lower(name)=lower('{UnitOfMeasurement.name}')")
            row = cursor.fetchone()
            if row:
                raise DataLayerException(f"{UnitOfMeasurement.name} exists")
            cursor.execute(
                f"insert into ac_uom (name) values('{UnitOfMeasurement.name}')")
            connection.commit()
    # Fetch generated code
            cursor.execute(
                f"select code from ac_uom where lower(name)=lower('{UnitOfMeasurement.name}')")
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
        if UnitOfMeasurement.code is None:
            raise DataLayerException("Code required")
        if UnitOfMeasurement.code <= 0:
            raise DataLayerException("Invalid code")
        if not UnitOfMeasurement.name or len(UnitOfMeasurement.name.strip()) == 0:
            raise DataLayerException("Name required")
        if len(UnitOfMeasurement.name.strip()) > 5:
            raise DataLayerException("Name cannot exceed 5 characters")
        connection = DBConnection.getConnection()
        try:
            cursor = connection.cursor()
            cursor.execute(
                f"SELECT code FROM ac_uom WHERE code = {UnitOfMeasurement.code}")
            row = cursor.fetchone()
            if not row:
                raise DataLayerException(
                    f"Invalid code: {UnitOfMeasurement.code}")
    # Check for duplicate name with different code
            cursor.execute(
                f"SELECT code FROM ac_uom WHERE LOWER(name) = LOWER('{UnitOfMeasurement.name}') AND code <> {UnitOfMeasurement.code}")
            row = cursor.fetchone()
            if row:
                raise DataLayerException(
                    f"{UnitOfMeasurement.name} already exists")
    # Perform update
            cursor.execute(
                f"UPDATE ac_uom SET name = '{UnitOfMeasurement.name}' WHERE code = {UnitOfMeasurement.code}")
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
        if code is None:
            raise DataLayerException("Code required")
        if code <= 0:
            raise DataLayerException("Invalid code")
        connection = DBConnection.getConnection()
        try:
            cursor = connection.cursor()
        # Check if code exists
            cursor.execute(f"SELECT code FROM ac_uom WHERE code = {code}")
            row = cursor.fetchone()
            if not row:
                raise DataLayerException(f"Invalid code: {code}")
            cursor.execute(
                f"SELECT uom_code FROM ac_item_uom WHERE uom_code = {code}")
            row = cursor.fetchone()
            if row:
                raise DataLayerException(
                    f"Unit of Measurement with code {code} has been allotted to an item")
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
                uom = UnitofMeasurement(code=int(row[0]), name=row[1].strip())
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
        if code is None:
            raise DataLayerException("Code required")
        if code <= 0:
            raise DataLayerException("Invalid code")
        connection = DBConnection.getConnection()
        try:
            cursor = connection.cursor()
            cursor.execute(
                f"SELECT code, name FROM ac_uom WHERE code = {code}")
            row = cursor.fetchone()
            if not row:
                raise DataLayerException(f"Invalid code: {code}")
            uom = UnitofMeasurement(code=int(row[0]), name=row[1].strip())
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
        if not name:
            raise DataLayerException("Name required")
        if len(name) <= 0 or len(name) > 5:
            raise DataLayerException("Invalid name length")
        connection = DBConnection.getConnection()
        try:
            cursor = connection.cursor()
            cursor.execute(
                f"SELECT code, name FROM ac_uom WHERE lower(name) = lower('{name}')")
            row = cursor.fetchone()
            if not row:
                raise DataLayerException(f"Invalid name: {name}")
            uom = UnitofMeasurement(code=int(row[0]), name=row[1].strip())
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
        if not item.name or len(item.name.strip()) == 0:
            raise DataLayerException("Item name required")
        if len(item.name) > 25:
            raise DataLayerException("Name cannot exceed 25 characters")

        if not item.hsnCode or len(item.hsnCode) < 4 or len(item.hsnCode) > 10:
            raise DataLayerException(
                "HSN Code must be between 4 to 10 characters")

        item.cgst = item.cgst or 0
        item.sgst = item.sgst or 0
        item.igst = item.igst or 0

        if item.cgst < 0 or item.sgst < 0 or item.igst < 0:
            raise DataLayerException("Tax cannot be negative")

        connection = DBConnection.getConnection()
        if not connection:
            raise DataLayerException("Unable to connect to database")

        cursor = None
        try:
            cursor = connection.cursor()

            # check duplicate
            cursor.execute(
                "SELECT code FROM ac_item WHERE LOWER(name)=LOWER(%s)", (item.name,))
            if cursor.fetchone():
                raise DataLayerException("Item already exists")

            cursor.execute(
                "INSERT INTO ac_item (name, hsn_code) VALUES (%s, %s)", (item.name, item.hsnCode))

            item.code = cursor.lastrowid

            # INSERT TAX
            cursor.execute(
                """
                INSERT INTO ac_item_tax (item_code, cgst, sgst, igst)
                VALUES (%s, %s, %s, %s)
                """,
                (item.code, item.cgst, item.sgst, item.igst)
            )

            # INSERT UOM
            if item.unitofMeasurments:
                for uom in item.unitofMeasurments:
                    cursor.execute(
                        """
                        INSERT INTO ac_item_uom (item_code, uom_code)
                        VALUES (%s, %s)
                        """,
                        (item.code, uom.code)
                    )

            connection.commit()
            print("Item inserted successfully")

        except Exception as e:
            connection.rollback()
            raise DataLayerException(str(e))

        finally:
            if cursor:
                cursor.close()
            connection.close()

    # ---------------- UPDATE ITEM ----------------
    def update(self, item):
        if not item.code:
            raise DataLayerException("Item code required")

        connection = DBConnection.getConnection()
        if not connection:
            raise DataLayerException("Unable to connect to database")

        cursor = None
        try:
            cursor = connection.cursor()

            cursor.execute(
                "SELECT code FROM ac_item WHERE code=%s",
                (item.code,)
            )
            if not cursor.fetchone():
                raise DataLayerException("Item not found")

            cursor.execute(
                """
                UPDATE ac_item
                SET name=%s, hsn_code=%s
                WHERE code=%s
                """,
                (item.name, item.hsnCode, item.code)
            )

            cursor.execute(
                """
                UPDATE ac_item_tax
                SET cgst=%s, sgst=%s, igst=%s
                WHERE item_code=%s
                """,
                (item.cgst, item.sgst, item.igst, item.code)
            )

            cursor.execute(
                "DELETE FROM ac_item_uom WHERE item_code=%s",
                (item.code,)
            )

            if item.unitofMeasurments:
                for uom in item.unitofMeasurments:
                    cursor.execute(
                        """
                        INSERT INTO ac_item_uom (item_code, uom_code)
                        VALUES (%s, %s)
                        """,
                        (item.code, uom.code)
                    )

            connection.commit()

        except Exception as e:
            connection.rollback()
            raise DataLayerException(str(e))

        finally:
            if cursor:
                cursor.close()
            connection.close()

    # ---------------- REMOVE ITEM ----------------
    def remove(self, code):
        if not code or code <= 0:
            raise DataLayerException("Invalid code")

        connection = DBConnection.getConnection()
        if not connection:
            raise DataLayerException("Unable to connect to database")

        cursor = None
        try:
            cursor = connection.cursor()

            cursor.execute(
                "SELECT code FROM ac_item WHERE code=%s",
                (code,)
            )
            if not cursor.fetchone():
                raise DataLayerException("Item not found")

            cursor.execute(
                "DELETE FROM ac_item_uom WHERE item_code=%s", (code,))
            cursor.execute(
                "DELETE FROM ac_item_tax WHERE item_code=%s", (code,))
            cursor.execute("DELETE FROM ac_item WHERE code=%s", (code,))

            connection.commit()
            print("Item deleted successfully")

        except Exception as e:
            connection.rollback()
            raise DataLayerException(str(e))

        finally:
            if cursor:
                cursor.close()
            connection.close()

    # ---------------- GET ALL ----------------
    def getAll(self):
        connection = DBConnection.getConnection()
        if not connection:
            raise DataLayerException("Unable to connect to database")

        items = []
        cursor = None

        try:
            cursor = connection.cursor()
            cursor.execute(
                "SELECT code, name, hsn_code FROM ac_item ORDER BY code")
            rows = cursor.fetchall()
            for row in rows:
                code = row[0]

                cursor.execute(
                    "SELECT cgst, sgst, igst FROM ac_item_tax WHERE item_code=%s",
                    (code,)
                )
                tax = cursor.fetchone()

                cursor.execute(
                    """
                    SELECT u.code, u.name
                    FROM ac_item_uom iu
                    JOIN ac_uom u ON iu.uom_code = u.code
                    WHERE iu.item_code=%s
                    """,
                    (code,)
                )
                uoms = cursor.fetchall()

                item = Item(
                    code=row[0],
                    name=row[1],
                    hsnCode=row[2],
                    cgst=tax[0] if tax else 0,
                    sgst=tax[1] if tax else 0,
                    igst=tax[2] if tax else 0,
                    unitofMeasurments=[
                        UnitofMeasurement(u[0], u[1]) for u in uoms
                    ]
                )

                items.append(item)

            return items

        except Exception as e:
            raise DataLayerException(str(e))

        finally:
            if cursor:
                cursor.close()
            connection.close()

    # ---------------- GET BY CODE ----------------
    def getByCode(self, code):
        if not code or code <= 0:
            raise DataLayerException("Invalid code")

        connection = DBConnection.getConnection()
        cursor = None

        try:
            cursor = connection.cursor()

            cursor.execute(
                "SELECT code, name, hsn_code FROM ac_item WHERE code=%s",
                (code,)
            )
            row = cursor.fetchone()

            if not row:
                raise DataLayerException("Item not found")

            cursor.execute(
                "SELECT cgst, sgst, igst FROM ac_item_tax WHERE item_code=%s",
                (code,)
            )
            tax = cursor.fetchone()

            cursor.execute(
                """
                SELECT u.code, u.name
                FROM ac_item_uom iu
                JOIN ac_uom u ON iu.uom_code = u.code
                WHERE iu.item_code=%s
                """,
                (code,)
            )
            uoms = cursor.fetchall()

            return Item(
                code=row[0],
                name=row[1],
                hsnCode=row[2],
                cgst=tax[0] if tax else 0,
                sgst=tax[1] if tax else 0,
                igst=tax[2] if tax else 0,
                unitofMeasurments=[
                    UnitofMeasurement(u[0], u[1]) for u in uoms
                ]
            )

        finally:
            if cursor:
                cursor.close()
            connection.close()


class StateManager:
    def __init__(self):
        pass

    def getAll(self):
        connection = DBConnection.getConnection()
        if not connection:
            raise DataLayerException("Unable to connect to database")
        states = []
        try:
            cursor = connection.cursor()
            cursor.execute(
                "SELECT code, name, alpha_code FROM ac_state ORDER BY code")
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
        if not code or code <= 0:
            raise DataLayerException("Invalid state code")
        connection = DBConnection.getConnection()
        if not connection:
            raise DataLayerException("Unable to connect to database")
        try:
            cursor = connection.cursor()
            cursor.execute(
                "SELECT code, name, alpha_code FROM ac_state WHERE code = :code", {"code": code})
            row = cursor.fetchone()
            if not row:
                raise DataLayerException(f"State with code {code} not found")
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
        if not alphaCode or len(alphaCode) != 2:
            raise DataLayerException("Invalid Alpha Code")
        connection = DBConnection.getConnection()
        if not connection:
            raise DataLayerException("Unable to connect to database")
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
            if not row:
                raise DataLayerException(
                    f"State with Alpha Code '{alphaCode}' not found")
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

    # 🔹 ADD TRADER
    def add(self, trader):
        if not trader or not trader.name or not trader.address or not trader.stateCode:
            raise DataLayerException("Missing required trader details")

        connection = DBConnection.getConnection()
        if not connection:
            raise DataLayerException("Unable to connect to database")

        cursor = None
        try:
            cursor = connection.cursor()

            cursor.execute("""
                INSERT INTO ac_trader (
                    name, address, gst_num, reg_title_1, reg_value_1,
                    contact_1, contact_2, state_code,
                    bank_name, account_no, branch_name, ifsc_code
                ) VALUES (
                    %s, %s, %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s, %s
                )
            """, (
                trader.name,
                trader.address,
                trader.gstNum,
                trader.regTitle1,
                trader.regValue1,
                trader.contact1,
                trader.contact2,
                trader.stateCode,
                trader.bankName,
                trader.accountNo,
                trader.branchName,
                trader.ifscCode
            ))

            connection.commit()

            # 🔥 return generated ID
            return cursor.lastrowid

        except Exception as e:
            connection.rollback()
            raise DataLayerException(str(e))

        finally:
            if cursor:
                cursor.close()
                connection.close()

    # 🔹 GET ALL TRADERS

    def getAll(self):
        connection = DBConnection.getConnection()
        if not connection:
            raise DataLayerException("Unable to connect to database")

        cursor = None
        try:
            cursor = connection.cursor()

            cursor.execute("""
                SELECT CODE, NAME, ADDRESS, GST_NUM, REG_TITLE_1, REG_VALUE_1,
                       CONTACT_1, CONTACT_2, STATE_CODE,
                       BANK_NAME, ACCOUNT_NO, BRANCH_NAME, IFSC_CODE
                FROM ac_trader order by code
            """)

            rows = cursor.fetchall()

            traders = []
            for row in rows:
                traders.append({
                    "code": row[0],
                    "name": row[1],
                    "address": row[2],
                    "gstNum": row[3],
                    "regTitle1": row[4],
                    "regValue1": row[5],
                    "contact1": row[6],
                    "contact2": row[7],
                    "stateCode": row[8],
                    "bankName": row[9],
                    "accountNo": row[10],
                    "branchName": row[11],
                    "ifscCode": row[12]
                })

            return traders

        except Exception as e:
            raise DataLayerException(str(e))

        finally:
            if cursor:
                cursor.close()
                connection.close()

    # 🔹 GET BY CODE

    def getByCode(self, code):
        if not code:
            raise DataLayerException("Code is required")

        connection = DBConnection.getConnection()
        cursor = connection.cursor()

        try:
            cursor.execute("""
                SELECT CODE, NAME, ADDRESS, GST_NUM, REG_TITLE_1, REG_VALUE_1,
                       CONTACT_1, CONTACT_2, STATE_CODE,
                       BANK_NAME, ACCOUNT_NO, BRANCH_NAME, IFSC_CODE
                FROM ac_trader
                WHERE CODE = %s
            """, (code,))

            row = cursor.fetchone()
            if not row:
                return None

            return {
                "code": row[0],
                "name": row[1],
                "address": row[2],
                "gstNum": row[3],
                "regTitle1": row[4],
                "regValue1": row[5],
                "contact1": row[6],
                "contact2": row[7],
                "stateCode": row[8],
                "bankName": row[9],
                "accountNo": row[10],
                "branchName": row[11],
                "ifscCode": row[12]
            }

        except Exception as e:
            raise DataLayerException(str(e))

        finally:
            cursor.close()
            connection.close()

    # 🔹 UPDATE TRADER

    def update(self, trader):
        if not trader or not trader.code:
            raise DataLayerException("Trader code is required")

        connection = DBConnection.getConnection()
        cursor = connection.cursor()

        try:
            cursor.execute(
                "SELECT COUNT(*) FROM ac_trader WHERE code = %s",
                (trader.code,)
            )
            if cursor.fetchone()[0] == 0:
                raise DataLayerException("Trader not found")

            cursor.execute("""
                UPDATE ac_trader SET 
                    name=%s, address=%s, gst_num=%s,
                    reg_title_1=%s, reg_value_1=%s,
                    contact_1=%s, contact_2=%s,
                    state_code=%s,
                    bank_name=%s, account_no=%s,
                    branch_name=%s, ifsc_code=%s
                WHERE code=%s
            """, (
                trader.name,
                trader.address,
                trader.gstNum,
                trader.regTitle1,
                trader.regValue1,
                trader.contact1,
                trader.contact2,
                trader.stateCode,
                trader.bankName,
                trader.accountNo,
                trader.branchName,
                trader.ifscCode,
                trader.code
            ))

            connection.commit()
            return True

        except Exception as e:
            connection.rollback()
            raise DataLayerException(str(e))

        finally:
            cursor.close()
            connection.close()

    # 🔹 DELETE TRADER

    def remove(self, code):
        if not code:
            raise DataLayerException("Trader code is required")

        connection = DBConnection.getConnection()
        cursor = connection.cursor()

        try:
            cursor.execute(
                "SELECT COUNT(*) FROM ac_trader WHERE code = %s",
                (code,)
            )
            if cursor.fetchone()[0] == 0:
                raise DataLayerException("Trader not found")

            cursor.execute("DELETE FROM ac_trader WHERE code = %s", (code,))
            connection.commit()

            return True

        except Exception as e:
            connection.rollback()
            raise DataLayerException(str(e))

        finally:
            cursor.close()
            connection.close()


class CustomerManager:
    def __init__(self):
        pass

    def hasInvoices(self, customer_code):
        connection = DBConnection.getConnection()
        cursor = connection.cursor()

        cursor.execute(
            "SELECT COUNT(*) FROM ac_invoice WHERE customer_code = %s",
            (customer_code,)
        )

        count = cursor.fetchone()[0]

        cursor.close()
        connection.close()

        return count > 0

    # ---------------- ADD ----------------
    def add(self, customer):
        connection = DBConnection.getConnection()
        if connection is None:
            raise DataLayerException("Unable to connect to database")

        try:
            cursor = connection.cursor()

            cursor.execute("""
                INSERT INTO ac_customer (
                    NAME, ADDRESS, REG_TITLE_1, REG_VALUE_1,
                    REG_TITLE_2, REG_VALUE_2, REG_TITLE_3, REG_VALUE_3,
                    CONTACT_1, CONTACT_2, CONTACT_3, STATE_CODE
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                customer.name,
                customer.address,
                customer.regTitle1,
                customer.regValue1,
                customer.regTitle2,
                customer.regValue2,
                customer.regTitle3,
                customer.regValue3,
                customer.contact1,
                customer.contact2,
                customer.contact3,
                customer.stateCode
            ))

            connection.commit()

            # AUTO_INCREMENT ID
            customer.code = cursor.lastrowid
            return customer.code

        except Exception as e:
            connection.rollback()
            raise DataLayerException(str(e))

        finally:
            cursor.close()
            connection.close()

    # ---------------- UPDATE ----------------
    def update(self, customer):
        if not customer or not customer.get("code"):
            raise DataLayerException("Customer code is required")

        connection = DBConnection.getConnection()
        if connection is None:
            raise DataLayerException("Unable to connect to database")

        try:
            cursor = connection.cursor()

            cursor.execute("""
                UPDATE ac_customer SET
                    NAME=%s,
                    ADDRESS=%s,
                    REG_TITLE_1=%s,
                    REG_VALUE_1=%s,
                    REG_TITLE_2=%s,
                    REG_VALUE_2=%s,
                    REG_TITLE_3=%s,
                    REG_VALUE_3=%s,
                    CONTACT_1=%s,
                    CONTACT_2=%s,
                    CONTACT_3=%s,
                    STATE_CODE=%s
                WHERE CODE=%s
            """, (
                customer["name"],
                customer["address"],
                customer.get("regTitle1"),
                customer.get("regValue1"),
                customer.get("regTitle2"),
                customer.get("regValue2"),
                customer.get("regTitle3"),
                customer.get("regValue3"),
                customer.get("contact1"),
                customer.get("contact2"),
                customer.get("contact3"),
                customer.get("stateCode", 1),
                customer["code"]
            ))

            if cursor.rowcount == 0:
                raise DataLayerException(
                    f"No customer found with code {customer['code']}")

            connection.commit()
            return {"success": True, "message": "Customer updated"}

        except Exception as e:
            connection.rollback()
            raise DataLayerException(str(e))

        finally:
            cursor.close()
            connection.close()

    # ---------------- GET BY CODE ----------------
    def getByCode(self, code):
        if not code or code <= 0:
            raise DataLayerException("Invalid code")

        connection = DBConnection.getConnection()

        try:
            cursor = connection.cursor()

            cursor.execute("""
                SELECT CODE, NAME, ADDRESS, REG_TITLE_1, REG_VALUE_1,
                       REG_TITLE_2, REG_VALUE_2, REG_TITLE_3, REG_VALUE_3,
                       CONTACT_1, CONTACT_2, CONTACT_3, STATE_CODE
                FROM ac_customer
                WHERE CODE=%s
            """, (code,))

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

    # ---------------- DELETE ----------------
    def remove(self, code):
        if not code or code <= 0:
            raise DataLayerException("Invalid code")

        if self.hasInvoices(code):
            raise DataLayerException("Customer has invoices")

        connection = DBConnection.getConnection()

        try:
            cursor = connection.cursor()

            cursor.execute(
                "DELETE FROM ac_customer WHERE CODE=%s",
                (code,)
            )

            if cursor.rowcount == 0:
                raise DataLayerException(f"No customer found with code {code}")

            connection.commit()
            return {"success": True, "message": "Customer deleted"}

        except Exception as e:
            connection.rollback()
            raise DataLayerException(str(e))

        finally:
            cursor.close()
            connection.close()

    # ---------------- GET ALL ----------------
    def getAll(self):
        connection = DBConnection.getConnection()

        try:
            cursor = connection.cursor()

            cursor.execute("""
                SELECT CODE, NAME, ADDRESS, REG_TITLE_1, REG_VALUE_1,
                       REG_TITLE_2, REG_VALUE_2, REG_TITLE_3, REG_VALUE_3,
                       CONTACT_1, CONTACT_2, CONTACT_3, STATE_CODE
                FROM ac_customer
                ORDER BY code
            """)

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


class InvoiceItemManager:

    def add(self, invoiceItem):
        connection = None
        cursor = None

        try:
            connection = DBConnection.getConnection()
            if connection is None:
                raise DataLayerException("DB connection failed")

            cursor = connection.cursor()

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
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                invoiceItem.invoiceCode,
                invoiceItem.itemCode,
                invoiceItem.rate,
                invoiceItem.quantity,
                invoiceItem.sgst,
                invoiceItem.cgst,
                invoiceItem.igst,
                0,  # trigger handles
                0   # trigger handles
            ))

            connection.commit()

        except Exception as e:
            if connection:
                connection.rollback()
            raise DataLayerException(str(e))

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    def getByInvoiceCode(self, invoiceCode):
        connection = None
        cursor = None

        try:
            connection = DBConnection.getConnection()
            cursor = connection.cursor(dictionary=True)

            cursor.execute("""
                SELECT *
                FROM ac_invoice_item
                WHERE invoice_code = %s
            """, (invoiceCode,))

            rows = cursor.fetchall()

            from datalayer.entities import InvoiceItem

            items = []
            for r in rows:
                items.append(InvoiceItem(
                    invoiceCode=r["invoice_code"],
                    itemCode=r["item_code"],
                    rate=r["rate"],
                    quantity=r["quantity"],
                    sgst=r["sgst"],
                    cgst=r["cgst"],
                    igst=r["igst"],
                    taxableAmount=r["taxable_amount"],
                    totalAmount=r["total_amount"]
                ))

            return items

        except Exception as e:
            raise DataLayerException(str(e))

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

class InvoiceManager:
    def __init__(self):
        pass

    def add(self, invoice):
        connection = None
        cursor = None

        if not invoice.customerCode:
            raise DataLayerException("Customer required")

        if not invoice.traderCode:
            raise DataLayerException("Trader required")

        if not invoice.items or len(invoice.items) == 0:
            raise DataLayerException("Invoice must have at least one item")

        try:
            connection = DBConnection.getConnection()
            if connection is None:
                raise DataLayerException("Unable to connect to database")

            # ✅ IMPORTANT: dictionary cursor
            cursor = connection.cursor(dictionary=True)

            # ---------------------------
            # 1. INSERT INVOICE
            # ---------------------------
            cursor.execute("""
                INSERT INTO ac_invoice (
                    customer_code,
                    invoice_date,
                    total_amount,
                    created_on,
                    trader_code
                )
                VALUES (%s, %s, %s, %s, %s)
            """, (
                invoice.customerCode,
                invoice.invoiceDate,
                0,
                invoice.createdOn,
                invoice.traderCode
            ))

            invoiceCode = cursor.lastrowid

            # ---------------------------
            # 2. GET STATE CODES (DIRECT DB - BEST PRACTICE)
            # ---------------------------
            cursor.execute(
                "SELECT state_code FROM ac_trader WHERE code=%s",
                (invoice.traderCode,)
            )
            trader = cursor.fetchone()

            cursor.execute(
                "SELECT state_code FROM ac_customer WHERE code=%s",
                (invoice.customerCode,)
            )
            customer = cursor.fetchone()

            # ✅ SAFE EXTRACTION
            trader_state = trader.get("state_code") if trader else None
            customer_state = customer.get("state_code") if customer else None

            if trader_state is None:
                raise DataLayerException("Trader STATE_CODE missing")

            if customer_state is None:
                raise DataLayerException("Customer STATE_CODE missing")

            same_state = trader_state == customer_state

            # DEBUG (optional)
            print("Trader State:", trader_state)
            print("Customer State:", customer_state)

            # ---------------------------
            # 3. INSERT ITEMS WITH GST
            # ---------------------------
            data = []

            for item in invoice.items:
                taxable_amount = item.rate * item.quantity

                if same_state:
                    cgst_amt = taxable_amount * (item.cgst / 100)
                    sgst_amt = taxable_amount * (item.sgst / 100)
                    igst_amt = 0

                    cgst_percent = item.cgst
                    sgst_percent = item.sgst
                    igst_percent = 0
                else:
                    cgst_amt = 0
                    sgst_amt = 0
                    igst_amt = taxable_amount * (item.igst / 100)

                    cgst_percent = 0
                    sgst_percent = 0
                    igst_percent = item.igst

                total_amount = taxable_amount + cgst_amt + sgst_amt + igst_amt

                data.append((
                    invoiceCode,
                    item.itemCode,
                    item.rate,
                    item.quantity,
                    sgst_percent,
                    cgst_percent,
                    igst_percent,
                    taxable_amount,
                    total_amount
                ))

            cursor.executemany("""
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
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, data)

            connection.commit()

            # ---------------------------
            # 4. FETCH FINAL DATA
            # ---------------------------
            cursor.execute("""
                SELECT *
                FROM vw_invoice_details
                WHERE invoice_code = %s
            """, (invoiceCode,))

            invoice_data = cursor.fetchone()

            return {
                "success": True,
                "invoiceCode": invoiceCode,
                "data": invoice_data
            }

        except Exception as e:
            if connection:
                connection.rollback()
            raise DataLayerException(str(e))

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
    # ---------------- GET ALL ----------------
    def getAll(self):
        connection = None
        cursor = None

        try:
            connection = DBConnection.getConnection()
            cursor = connection.cursor(dictionary=True)

            cursor.execute("SELECT * FROM vw_invoice_details")

            return cursor.fetchall()

        except Exception as e:
            raise DataLayerException(str(e))

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    def getInvoiceDetails(self, invoiceCode):
        connection = None
        cursor = None

        try:
            connection = DBConnection.getConnection()
            cursor = connection.cursor(dictionary=True)

            cursor.execute("""
            SELECT *
            FROM vw_invoice_details
            WHERE invoice_code = %s
        """, (invoiceCode,))

            invoice = cursor.fetchone()

            if not invoice:
                raise DataLayerException("Invoice not found")

        # DEBUG (optional)
            print("INVOICE DATA:", invoice)

            itemManager = InvoiceItemManager()
            items = itemManager.getByInvoiceCode(invoiceCode)

            return {
            "invoice": invoice,
            "items": items
        }

        except Exception as e:
            raise DataLayerException(str(e))

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()
    # ---------------- DELETE ----------------

    def delete(self, code: int):
        connection = None
        cursor = None

        try:
            connection = DBConnection.getConnection()

            if connection is None:
                raise DataLayerException("DB connection failed")

            cursor = connection.cursor()

        # ---------------------------
        # 1. DELETE CHILD TABLES FIRST
        # ---------------------------

        # invoice items delete
            cursor.execute("""
            DELETE FROM ac_invoice_item
            WHERE invoice_code = %s
        """, (code,))

        # ---------------------------
        # 2. DELETE PARENT TABLE
        # ---------------------------
            cursor.execute("""
            DELETE FROM ac_invoice
            WHERE code = %s
        """, (code,))

        # ---------------------------
        # 3. COMMIT TRANSACTION
        # ---------------------------
            connection.commit()

            return True

        except Exception as e:
            if connection:
                connection.rollback()
            raise DataLayerException(str(e))

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()


class DashBoardManager:

    def getDashboard(self):
        connection = None
        cursor = None

        try:
            connection = DBConnection.getConnection()
            cursor = connection.cursor(dictionary=True)

            # TOTAL CUSTOMERS
            cursor.execute("SELECT COUNT(*) AS totalCustomers FROM ac_customer")
            customers = cursor.fetchone()["totalCustomers"]

            # TOTAL INVOICES
            cursor.execute("SELECT COUNT(*) AS totalInvoices FROM ac_invoice")
            invoices = cursor.fetchone()["totalInvoices"]

            # TOTAL AMOUNT
            cursor.execute("SELECT SUM(total_amount) AS totalAmount FROM ac_invoice")
            totalAmount = cursor.fetchone()["totalAmount"] or 0

            # 🚫 NO PAYMENT TABLE YET
            payments = 0
            outstanding = totalAmount

            return {
                "customers": customers,
                "invoices": invoices,
                "totalAmount": float(totalAmount),
                "payments": float(payments),
                "outstanding": float(outstanding)
            }

        except Exception as e:
            raise DataLayerException("Error fetching dashboard data: " + str(e))

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()


class UserManager:

    def __init__(self):
        pass

    # ---------------- HASH PASSWORD ----------------
    def _hash_password(self, password: str) -> str:
        return bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

    # ---------------- VERIFY PASSWORD ----------------
    def _verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )

    # ---------------- ADD USER ----------------
    def add(self, user: User):
        connection = None
        cursor = None

        try:
            connection = DBConnection.getConnection()
            if connection is None:
                raise DataLayerException("Unable to connect to database")

            cursor = connection.cursor()

            hashed_password = self._hash_password(user.password)

            cursor.execute("""
                INSERT INTO users (name, email, password, role, created_at)
                VALUES (%s, %s, %s, %s, NOW())
            """, (
                user.name,
                user.email,
                hashed_password,
                user.role
            ))

            connection.commit()

        except Exception as e:
            if connection:
                connection.rollback()
            raise DataLayerException(str(e))

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    # ---------------- GET BY EMAIL ----------------
    def getByEmail(self, email: str):
        connection = None
        cursor = None

        try:
            connection = DBConnection.getConnection()
            if connection is None:
                raise DataLayerException("Unable to connect to database")

            cursor = connection.cursor()

            cursor.execute("""
                SELECT id, name, email, password, role, created_at
                FROM users
                WHERE email = %s
            """, (email,))

            row = cursor.fetchone()

            if not row:
                return None

            return User(
                id=row[0],
                name=row[1],
                email=row[2],
                password=row[3],
                role=row[4],
                createdAt=row[5]
            )

        except Exception as e:
            raise DataLayerException(str(e))

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    # ---------------- GET ALL USERS ----------------
    def getAll(self):
        connection = None
        cursor = None

        try:
            connection = DBConnection.getConnection()
            if connection is None:
                raise DataLayerException("Unable to connect to database")

            cursor = connection.cursor()

            cursor.execute("""
                SELECT id, name, email, role, created_at
                FROM users
                ORDER BY created_at DESC
            """)

            users = []

            for row in cursor.fetchall():
                users.append({
                    "id": row[0],
                    "name": row[1],
                    "email": row[2],
                    "role": row[3],
                    "createdAt": row[4].strftime("%Y-%m-%d") if row[4] else None
                })

            return users

        except Exception as e:
            raise DataLayerException(str(e))

        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

    # ---------------- VALIDATE PASSWORD ----------------
    def validate_password(self, plain_password: str, hashed_password: str) -> bool:
        try:
            return self._verify_password(plain_password, hashed_password)
        except Exception as e:
            raise DataLayerException("Password validation failed: " + str(e))
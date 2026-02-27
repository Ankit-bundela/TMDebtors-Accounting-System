import cx_Oracle as oracle
#from datalayer.config import DBUtility
from datalayer.config import DBUtility

from datalayer.exceptions import DataLayerException

class DBConnection:
    @staticmethod
    def getConnection():
        dbConfiguration = DBUtility.getDBConfiguration()
        if dbConfiguration.has_exceptions:
            raise DataLayerException(exceptions=dbConfiguration.exceptions)
        dsn = f"{dbConfiguration.host}:{dbConfiguration.port}/{dbConfiguration.database}"
        try:
            connection = oracle.connect(
                user=dbConfiguration.user,
                password=dbConfiguration.password,
                dsn=dsn
            )
        except oracle.DatabaseError as error:
            raise DataLayerException(str(error))
        return connection

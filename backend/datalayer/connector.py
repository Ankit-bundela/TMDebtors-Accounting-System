"""
from mysql.connector import connect,Error

from datalayer.config import DBUtility

from datalayer.exceptions import DataLayerException

class DBConnection:
    @staticmethod
    def getConnection():
        dbConfiguration = DBUtility.getDBConfiguration()
        if dbConfiguration.has_exceptions:
            raise DataLayerException(exceptions=dbConfiguration.exceptions)
        #dsn = f"{dbConfiguration.host}:{dbConfiguration.port}/{dbConfiguration.database}"
        try:
            connection = connect(
            host=dbConfiguration.host,
            port=dbConfiguration.port,
            user=dbConfiguration.user,
            password=dbConfiguration.password,
            database=dbConfiguration.database
)
        except connect.DatabaseError as error:
            raise DataLayerException(str(error))
        return connection
"""
from mysql.connector import connect, Error
from datalayer.config import DBConfiguration
from datalayer.exceptions import DataLayerException


class DBConnection:
    @staticmethod
    def getConnection():
        try:
            # Load DB config from environment (.env)
            config = DBConfiguration()

            # Create MySQL connection
            connection = connect(
                host=config.host,
                port=config.port,
                user=config.user,
                password=config.password,
                database=config.database,
                autocommit=True  # important for production
            )

            return connection

        except Error as error:
            raise DataLayerException(f"MySQL Connection Error: {str(error)}")

        except Exception as e:
            raise DataLayerException(f"Unexpected Error: {str(e)}")
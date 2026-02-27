from os import path
from xml.etree import ElementTree
from datalayer.exceptions import DataLayerException

class DBConfiguration:
    def __init__(self, host, port, database, user, password):
        self.exceptions = dict()
        self.has_exceptions = False
        self.host = host
        self.port = port
        self.user = user
        self.database = database
        self.password = password
        self._validate_values()

    def _validate_values(self):
        if not isinstance(self.host, str):
            self.exceptions["host"] = ('T', f"host is of type {type(self.host)}, should be str")
        if not isinstance(self.port, int):
            self.exceptions["port"] = ('T', f"port is of type {type(self.port)}, should be int")
        if not isinstance(self.database, str):
            self.exceptions["database"] = ('T', f"database is of type {type(self.database)}, should be str")
        if not isinstance(self.user, str):
            self.exceptions["user"] = ('T', f"user is of type {type(self.user)}, should be str")
        if not isinstance(self.password, str):
            self.exceptions["password"] = ('T', f"password is of type {type(self.password)}, should be str")

        if "host" not in self.exceptions and len(self.host) == 0:
            self.exceptions["host"] = ('V', "host missing")
        if "port" not in self.exceptions and (self.port <= 0 or self.port >= 65535):
            self.exceptions["port"] = ('V', f"port {self.port} should be between 1 and 65535")
        if "database" not in self.exceptions and len(self.database) == 0:
            self.exceptions["database"] = ('V', "database missing")
        if "user" not in self.exceptions and len(self.user) == 0:
            self.exceptions["user"] = ('V', "user missing")
        if "password" not in self.exceptions and len(self.password) == 0:
            self.exceptions["password"] = ('V', "password missing")

        if len(self.exceptions) > 0:
            self.has_exceptions = True

class DBUtility:
    @staticmethod
    def getDBConfiguration():
        # Hamesha current file ke relative path se dbconfig.xml dhundhe
        config_path = path.join(path.dirname(__file__), "dbconfig.xml")
        if not path.isfile(config_path):
            raise DataLayerException(
                "dbConfig.xml with database connection details is missing, refer documentation"
            )

        try:
            xmlTree = ElementTree.parse(config_path)
        except ElementTree.ParseError:
            raise DataLayerException("contents of dbconfig.xml are malformed")

        rootNode = xmlTree.getroot()
        host = port = database = user = password = None
        for node in rootNode:
            if node.tag == "host": host = node.text
            if node.tag == "port": port = node.text
            if node.tag == "name": database = node.text
            if node.tag == "user": user = node.text
            if node.tag == "password": password = node.text

        try:
            port = int(port)
        except:
            raise DataLayerException(f"port in dbconfig.xml should be int, got {type(port)}")

        return DBConfiguration(host, port, database, user, password)

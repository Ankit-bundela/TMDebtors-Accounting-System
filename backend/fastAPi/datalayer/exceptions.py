class DataLayerException(Exception):
    def __init__(self, message="", exceptions=None):
        self.message = message
        self.exceptions = exceptions

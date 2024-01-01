import os
from urllib.parse import quote_plus
from dotenv import load_dotenv
import pymongo


# Load environment variables
load_dotenv()


class Config:
    """
    Configuration constants and environment variables.
    """
    DATABASE_NAME = "Dramalytics"
    COLLECTION_NAME = "Dramalytics"
    # Read the sensitive information from environment variables
    USER_NAME = os.getenv("MONGO_DB_USERNAME")
    PASSWORD = os.getenv("MONGO_DB_PASSWORD")
    # Format the connection string with placeholders for username and password
    CONNECTION_STRING_TEMPLATE = "mongodb+srv://{username}:{password}@serverlessinstance0.ksq2r.mongodb.net/?retryWrites=true&w=majority"

    @staticmethod
    def get_connection_string():
        """
        Generates the connection string by inserting the encoded username and password.
        """
        return Config.CONNECTION_STRING_TEMPLATE.format(
            username=quote_plus(Config.USER_NAME),
            password=quote_plus(Config.PASSWORD)
        )


class Database:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Database, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        self.client = None
        self.db = None
        self.collection = None
        self.all_show_ids = None
        self.connect()

    def connect(self):
        """
        Establishes a connection to the MongoDB database and initializes data.
        """
        try:
            connection_uri = Config.get_connection_string()
            self.client = pymongo.MongoClient(connection_uri)
            self.db = self.client[Config.DATABASE_NAME]
            self.collection = self.db[Config.COLLECTION_NAME]
            self._initialize_show_ids()

            print("Connected to MongoDB")
        except Exception as e:
            print(f"Failed to connect to MongoDB: {e}")

    def _initialize_show_ids(self):
        """
        Initializes the list of all show IDs from the database.
        """
        self.all_show_ids = [show["show_id"]
                             for show in self.collection.find({}, {"show_id": 1, "_id": 0})]

    def add_show(self, show_json):
        """
        Adds a new show to the database and updates the cached show IDs.
        """
        try:
            self.collection.insert_one(show_json)
            self.all_show_ids.append(show_json["show_id"])
        except Exception as e:
            print(f"Failed to add show: {e}")

    def get_show(self, show_id):
        """
        Retrieves a show by its ID from the database.
        """
        try:
            return self.collection.find_one({"show_id": show_id}, {"_id": 0})
        except Exception as e:
            print(f"Failed to retrieve show: {e}")

    def get_all_show_ids(self):
        """
        Returns a list of all show IDs.
        """
        return self.all_show_ids


def get_database():
    """
    Retrieves the singleton instance of the database, connecting if necessary.
    """
    if not Database._instance:
        print("Creating new database instance")
        Database()
    return Database._instance


# Ensure the database is connected at import time
db = get_database()

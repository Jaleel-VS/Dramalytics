import pymongo
import dotenv
import os
from urllib.parse import quote_plus

# load environment variables
dotenv.load_dotenv()

CONNECTION_STRING = "mongodb+srv://{0}:{1}@serverlessinstance0.ksq2r.mongodb.net/?retryWrites=true&w=majority"
DATABASE_NAME = "Dramalytics"
COLLECTION = "Dramalytics"
USER_NAME = os.getenv("MONGO_DB_USERNAME")
PASSWORD = os.getenv("MONGO_DB_PASSWORD")

class Database:
    _instance = None

    # this is a singleton class, so we only want one instance of it
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(Database, cls).__new__(cls, *args, **kwargs)
        return cls._instance
    
    def __init__(self):
        self.collection = None
        self.all_show_ids: list[str] = None

    def connect(self):
        try:
            client = pymongo.MongoClient(CONNECTION_STRING.format(quote_plus(USER_NAME), quote_plus(PASSWORD)))
            db = client[DATABASE_NAME]
            self.collection = db[COLLECTION]

            # initialize all show ids
            self.all_show_ids = [show["show_id"] for show in self.collection.find({}, {"show_id": 1, "_id": 0})]

            print("Connected to MongoDB")
        except Exception as e:
            print(e)

    def add_show(self, show_json):
        try:
            self.collection.insert_one(show_json)
            # re-fetch all shows
            self.all_show_ids.append(show_json["id"])
        except Exception as e:
            print(e)
    
    def get_show(self, show_id):
        try:
            return self.collection.find_one({"show_id": show_id}, {"_id": 0})
        except Exception as e:
            print(e)

    def get_all_show_ids(self):
        return self.all_show_ids

def get_database():
    if not Database._instance:
        print("Creating new database instance")
        Database().connect()
    return Database._instance

# Ensure the database is connected at import time
db = get_database()

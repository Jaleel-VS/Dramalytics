from pydantic import BaseModel, Field
from bson import ObjectId as BsonObjectId
from typing import Any, Dict, List


# Helper function to convert ObjectId to string
def objectid_to_str(v: Any):
    if isinstance(v, BsonObjectId):
        return str(v)
    raise TypeError(f"Unsupported type: {type(v)}")

# Pydantic model that represents your episode structure
class Episode(BaseModel):
    id: int
    name: str
    episode_number: int
    vote_average: float
    vote_count: int

    # Customise the serialization of ObjectId to string
    class Config:
        json_encoders = {
            BsonObjectId: objectid_to_str
        }

# Pydantic model that represents your show structure
class Show(BaseModel):
    show_id: str
    episodes: Dict[str, List[Episode]]
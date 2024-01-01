from pydantic import BaseModel, Field
from typing import Any, Dict, List

# Helper function to convert ObjectId to string
def objectid_to_str(v: Any):
    if isinstance(v, BsonObjectId):
        return str(v)
    raise TypeError(f"Unsupported type: {type(v)}")

class Episode(BaseModel):
    id: int
    name: str
    episode_number: int
    vote_average: float

    class Config:
        json_encoders = {
            BsonObjectId: objectid_to_str
        }

class Show(BaseModel):
    show_id: str
    show_name: str
    poster_url: str
    episodes: Dict[str, List[Episode]]

from database import db
from fastapi import APIRouter, HTTPException
from fastapi.encoders import jsonable_encoder
from models import Show, Episode
import util

router = APIRouter()


@router.get("/search/{query}")
async def search(query: str):
    '''
    Search for a show and return the results.
    '''
    
    url = f"https://api.themoviedb.org/3/search/tv?query={query}&include_adult=false&language=en-US&page=1"

    

    response = util.get_response_object(url)

    if response.status_code != 200:
        return None
    
    results = util.format_search_results(response.json()["results"])

    # filter out shows that have 0 vote_count

    return [result for result in results if result["vote_count"] > 0]


@router.get("/show/{id}")
async def get_all_episodes(show_id: str):
    all_shows = db.get_all_show_ids()

    if show_id in all_shows:
        return db.get_show(show_id)
    
    seasons = util.get_seasons(show_id)

    if not seasons:
        raise HTTPException(status_code=404, detail="Show not found")
    
    episodes = {}

    for season in seasons:
        season_key = str(season["season_number"])
        # skip season 0
        if season_key == "0":
            continue
        # Convert episodes to Pydantic models
        episodes_data = util.get_episodes(show_id, season["season_number"])
        episodes[season_key] = [Episode(**episode_data) for episode_data in episodes_data]

    show = Show(
        show_id=show_id,
        episodes=episodes
    )

    # Convert Pydantic model to dictionary before adding to the database
    db_show = jsonable_encoder(show)

    # Now db_show is in the correct format to be added to MongoDB
    db.add_show(db_show)

    # When returning, you can still return the Pydantic model directly,
    # FastAPI will handle serialization to JSON
    return show


    


    
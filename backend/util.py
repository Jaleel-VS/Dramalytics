"""
Utility functions for the backend.
"""
import requests
import os
from fastapi.encoders import jsonable_encoder
from dotenv import load_dotenv
from database import db
from models import Show, Episode

# Load environment variables
load_dotenv()

# Configuration variables
API_KEY = os.getenv('API_KEY')
BASE_URL = "http://www.omdbapi.com/"

def make_request(endpoint, params):
    """
    Make a request to the OMDb API and return the response.
    """
    params['apikey'] = API_KEY
    response = requests.get(f"{BASE_URL}{endpoint}", params=params)
    if response.status_code != 200:
        return None
    return response.json()

def format_search_result_info(series):
    """
    Format the series information to be stored in the database
    """
    return {
        "imdb_id": series.get("imdbID"),
        "title": series.get("Title"),
        "year": series.get("Year"),
        "poster": series.get("Poster"),
    }

def get_series_by_title(title):
    """
    Search for a series by title and return a list of results.
    """
    response = make_request("", {'s': title, 'type': 'series'})
    if not response or 'Search' not in response:
        return None
    return [format_search_result_info(series) for series in response["Search"]]

def format_series_info(series):
    """
    Format the series information to be stored in the database
    """
    return {
        "imdb_id": series.get("imdbID"),
        "title": series.get("Title"),
        "year": series.get("Year"),
        "poster": series.get("Poster"),
        "plot": series.get("Plot"),
        "genre": series.get("Genre"),
        "rating": series.get("imdbRating"),
        "votes": series.get("imdbVotes"),
        "runtime": series.get("Runtime"),
        "seasons": series.get("totalSeasons"),
        "episodes": series.get("Episodes")
    }

def get_series_by_id(imdb_id):
    """
    Get the series information by imdb id
    """
    response = make_request("", {'i': imdb_id})
    if not response:
        return None
    return format_series_info(response)

def format_episode_info(episode, season):
    """
    Format the episode information to be stored in the database
    """
    return {
        "imdb_id": episode.get("imdbID"),
        "season": season,
        "episode": episode.get("Episode"),
        "title": episode.get("Title"),
        "rating": episode.get("imdbRating"),
    }

def get_episodes_for_series(imdb_id, season):
    """
    Get all episodes for a series per season
    """
    response = make_request("", {'i': imdb_id, 'Season': season})
    if not response or 'Episodes' not in response:
        return None
    return [format_episode_info(episode, season) for episode in response["Episodes"]]

def get_series_db_object(show_id):
    """
    Get the series information from the database
    """
    all_series_ids = db.get_all_show_ids()
    if show_id in all_series_ids:
        return db.get_show(show_id)
    return None

def get_series_from_api_call(show_id):
    """
    Get series information and episodes from API and add it to the database
    """
    series_info = get_series_by_id(show_id)
    if series_info is None:
        return None
    seasons = series_info.get("seasons")
    if not seasons:
        return None

    episodes_per_season = {}
    for season in range(1, int(seasons) + 1):
        episodes_data = get_episodes_for_series(show_id, str(season))
        if episodes_data:
            episodes_per_season[str(season)] = [Episode(**episode_data) for episode_data in episodes_data]

    show = Show(
        show_id=show_id,
        show_name=series_info.get("title"),
        poster_url=series_info.get("poster"),
        episodes=episodes_per_season
    )

    db_show = jsonable_encoder(show)
    db.add_show(db_show)
    return show

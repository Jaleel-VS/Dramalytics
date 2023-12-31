'''
Utility functions for the backend.
'''
import requests
import os
from dotenv import load_dotenv
from database import db

load_dotenv()

def get_response_object(url: str):
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {os.getenv('API_KEY')}"
    }

    response = requests.get(url, headers=headers)

    return response

def format_search_results(results: dict):
    return [
        {
            "id": result["id"],
            "original_name": result["name"],
            "overview": result["overview"],
            "vote_average": result["vote_average"],
            "vote_count": result["vote_count"],
            "poster_path": result["poster_path"],
            "backdrop_path": result["backdrop_path"],
            "first_air_date": result["first_air_date"],
        }
        for result in results
    ]


def get_seasons(id: str):
    # id, name, season_number, episode_count, vote_average

    url = f"https://api.themoviedb.org/3/tv/{id}?language=en-US"

    response = get_response_object(url)

    if response.status_code != 200:
        return None
    
    results = format_season_results(response.json()["seasons"])

    return results


def get_episodes(season_id: str, season_number: str):
    url = f"https://api.themoviedb.org/3/tv/{season_id}/season/{season_number}?language=en-US"

    response = get_response_object(url)

    if response.status_code != 200:
        return None
    
    results = format_episode_results(response.json()["episodes"])

    return results


def format_episode_results(results: dict):
    return [
        {
            "id": result["id"],
            "name": result["name"],
            # "overview": result["overview"],
            "episode_number": result["episode_number"],
            "vote_average": result["vote_average"],
            "vote_count": result["vote_count"],
        }
        for result in results
    ]

def format_season_results(results: dict):
    return [
        {
            "id": result["id"],
            "name": result["name"],
            "season_number": result["season_number"],
            "episode_count": result["episode_count"],
            "vote_average": result["vote_average"],
        }
        for result in results
    ]

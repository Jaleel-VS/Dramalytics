from fastapi import APIRouter, HTTPException
import util

router = APIRouter()


from fastapi import APIRouter, HTTPException, Query
import util

router = APIRouter()

@router.get("/search/{query}")
async def search(query: str = Query(..., min_length=2, max_length=100)) -> dict | HTTPException:
    '''
    Search for a show based on the query provided and return the results.
    The query should be a non-empty string with a maximum length of 100 characters.

    Parameters:
    - query: str - The title or partial title of the show to search for

    Returns:
    - A list of shows that match the query or a 404 error if no matches are found.
    '''
    
    results = util.get_series_by_title(query)

    if results:
        return results
    
    raise HTTPException(status_code=404, detail="No results found")



@router.get("/show/{id}")
async def get_all_episodes(show_id: str) -> dict | HTTPException:
    '''
    Get all episodes for a given show id.

    Parameters:
    - show_id: str - The imdb id of the show to get episodes for

    Returns:
    - A list of episodes for the show or a 404 error if the show is not found.
    '''
    show = util.get_series_db_object(show_id)

    if show:
        return show

    show = util.get_series_from_api_call(show_id)

    if show:
        return show
    
    raise HTTPException(status_code=404, detail="Show not found")


    


    
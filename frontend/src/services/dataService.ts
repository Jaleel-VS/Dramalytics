import axios from 'axios';

const API_BASE_URL = 'your-backend-api-url'; // Replace with your actual backend URL

export interface Show {
  show_id: string;
  show_name: string;
  poster_url: string;
  season_episodes: Record<string, Episode[]>;
}

export interface Episode {
  id: number;
  name: string;
  episode_number: number;
  vote_average: number;
  vote_count: number;
}

// Dummy Data

const dummyShow: Show = {
    show_id: "show123",
    show_name: "Dummy Show",
    poster_url: "http://dummyurl.com/poster",
    season_episodes: {
      "Season 1": [
        { id: 101, name: "Episode 1", episode_number: 1, vote_average: 10.1, vote_count: 110 },
        { id: 102, name: "Episode 2", episode_number: 2, vote_average: 5.2, vote_count: 120 },
        { id: 103, name: "Episode 3", episode_number: 3, vote_average: 5.3, vote_count: 130 },
        { id: 104, name: "Episode 4", episode_number: 4, vote_average: 5.4, vote_count: 140 },
        { id: 105, name: "Episode 5", episode_number: 5, vote_average: 5.5, vote_count: 150 }
      ],
      "Season 2": [
        { id: 201, name: "Episode 1", episode_number: 1, vote_average: 5.1, vote_count: 110 },
        { id: 202, name: "Episode 2", episode_number: 2, vote_average: 2.2, vote_count: 120 },
        { id: 203, name: "Episode 3", episode_number: 3, vote_average: 5.3, vote_count: 130 },
        { id: 204, name: "Episode 4", episode_number: 4, vote_average: 5.4, vote_count: 140 },
        { id: 205, name: "Episode 5", episode_number: 5, vote_average: 5.5, vote_count: 150 }
      ],
      "Season 3": [
        { id: 301, name: "Episode 1", episode_number: 1, vote_average: 5.1, vote_count: 110 },
        { id: 302, name: "Episode 2", episode_number: 2, vote_average: 5.2, vote_count: 120 },
        { id: 303, name: "Episode 3", episode_number: 3, vote_average: 5.3, vote_count: 130 },
        { id: 304, name: "Episode 4", episode_number: 4, vote_average: 5.4, vote_count: 140 },
        { id: 305, name: "Episode 5", episode_number: 5, vote_average: 5.5, vote_count: 150 }
      ],
      "Season 4": [
        { id: 401, name: "Episode 1", episode_number: 1, vote_average: 5.1, vote_count: 110 },
        { id: 402, name: "Episode 2", episode_number: 2, vote_average: 5.2, vote_count: 120 },
        { id: 403, name: "Episode 3", episode_number: 3, vote_average: 5.3, vote_count: 130 },
        { id: 404, name: "Episode 4", episode_number: 4, vote_average: 5.4, vote_count: 140 },
        { id: 405, name: "Episode 5", episode_number: 5, vote_average: 5.5, vote_count: 150 }
      ]
    }
  };


// export dummy data

export const fetchDummyShowData = async (_showId: string = "45"): Promise<Show | null> => {
  return dummyShow;
};



export const fetchShowData = async (showId: string): Promise<Show | null> => {
  try {
    const response = await axios.get<Show>(`${API_BASE_URL}/shows/${showId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching show data:", error);
    return null;
  }
};

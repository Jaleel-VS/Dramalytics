import { Episode } from "../services/dataService";

// Function to transform data for the heatmap
export const transformDataForHeatmap = (
  season_episodes: Record<string, Episode[]>
): HeatmapData[] => {
  const heatmapData: HeatmapData[] = [];

  Object.entries(season_episodes).forEach(([season, episodes]) => {
    episodes.forEach((episode) => {
      heatmapData.push({
        season: parseInt(season),
        episode: episode.episode_number,
        rating: episode.vote_average,
      });
    });
  });

  return heatmapData;
};

// Function to calculate average ratings for the column chart
export const calculateSeasonAverages = (
  season_episodes: Record<string, Episode[]>
): SeasonAverageData[] => {
  const seasonAverages: SeasonAverageData[] = [];

  Object.entries(season_episodes).forEach(([season, episodes]) => {
    const averageRating =
      episodes.reduce((acc, episode) => acc + episode.vote_average, 0) /
      episodes.length;
    seasonAverages.push({
      season: parseInt(season),
      averageRating: parseFloat(averageRating.toFixed(2)),
    });
  });

  return seasonAverages;
};

// Define the types for our transformed data
export interface HeatmapData {
  season: number;
  episode: number;
  rating: number;
}

export interface SeasonAverageData {
  season: number;
  averageRating: number;
}

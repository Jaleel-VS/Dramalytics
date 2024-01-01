import React, { useState, useEffect } from "react";
import { ShowHeatmap } from "./components/ShowHeatmap";
import { SeasonAverageChart } from "./components/SeasonAverageChart";
import { Show, fetchDummyShowData } from "./services/dataService";

const App: React.FC = () => {
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const showId = "the-show-id"; // Replace with actual show ID or retrieve from route params

    fetchDummyShowData(showId)
      .then((data) => {
        setShow(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch show data.");
        setLoading(false);
      });
  }, []); // Empty dependency array ensures this effect only runs once after the initial render

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  if (!show)
    return (
      <div className="text-center text-gray-500 p-4">No data available.</div>
    );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {show.show_name} Ratings
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <ShowHeatmap seasonEpisodes={show.season_episodes} />
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <SeasonAverageChart seasonEpisodes={show.season_episodes} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

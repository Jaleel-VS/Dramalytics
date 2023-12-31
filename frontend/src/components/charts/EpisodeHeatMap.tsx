import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { Episode, ShowData } from "./EpisodeColumnChart";

interface SeriesData {
  name: string;
  data: {
    x: string;
    y: number;
  }[];
}

const generateHeatMapData = (episodes: { [season: string]: Episode[] }) => {
  const series = Object.entries(episodes).map(([season, episodes]) => {
    return {
      name: `Season ${season}`,
      data: episodes.map((episode) => ({
        x: `${episode.episode_number}`,
        y: episode.vote_average,
      })),
    };
  });
  return series;
};

const EpisodeHeatMap: React.FC<{ showId: string }> = ({ showId }) => {
  const [series, setSeries] = useState<SeriesData[]>([]);
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/show/{id}?show_id=${showId}`)
      .then((response) => {
        const seriesData = generateHeatMapData(response.data.episodes);
        setSeries(seriesData);
        setOptions({
          chart: {
            height: 350,
            type: "heatmap",
            shadeIntensity: 0.9,
          },
          dataLabels: {
            enabled: true,
            formatter: function (val: number, opts: any) {
              return val.toFixed(1); // Format the label to one decimal place
            },
            style: {
              colors: ['#fff'] // Set the color of the label text if needed
            }
          },
        //   purple, blue, orange, red
            colors: ["#A020F0"],
          title: {
            text: "Episode Ratings HeatMap",
          },
          xaxis: {
            type: "category",
          },
        });
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [showId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data:</p>;

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="heatmap"
        height={350}
      />
    </div>
  );
};

export default EpisodeHeatMap;

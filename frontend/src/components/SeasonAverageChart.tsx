import React from "react";
import ReactApexChart from "react-apexcharts";
import { Episode, Show } from "../services/dataService";

interface SeasonAverageChartProps {
  seasonEpisodes: Record<string, Episode[]>;
}

export const SeasonAverageChart: React.FC<SeasonAverageChartProps> = ({
  seasonEpisodes,
}) => {
  // Calculate the average rating for each season
  const series = [
    {
      name: "Average Rating",
      data: Object.entries(seasonEpisodes).map(([season, episodes]) => {
        const average =
          episodes.reduce((acc, episode) => acc + episode.vote_average, 0) /
          episodes.length;
        return {
          x: `Season ${season}`,
          y: parseFloat(average.toFixed(2)), // Round to two decimal places for cleaner display
        };
      }),
    },
  ];

  // Define the options for ApexCharts
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      type: "category",
    },
    yaxis: {
      title: {
        text: "Average Rating (0-10)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => val.toFixed(2),
      },
    },
    title: {
      text: "Average Season Ratings",
    },
    colors: [
      function ({ value }: { value: number; _seriesIndex: number; _w: any }) {
        if (value < 5) {
          return "#ec644b";
        } else if (value < 7) {
          return "#f39c12";
        } else {
          return "#27ae60";
        }
      },
    ],
  };

  return (
    <ReactApexChart options={options} series={series} type="bar" height={350} />
  );
};

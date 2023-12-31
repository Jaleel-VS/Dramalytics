import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useFetch } from '../../hooks/useFetch';
import { ApexOptions } from 'apexcharts';

// example
/*
{
  "show_id": "19885",
  "episodes": {
    "1": [
      {
        "id": 578715,
        "name": "A Study in Pink",
        "episode_number": 1,
        "vote_average": 8.259,
        "vote_count": 191
      },
      {
        "id": 578717,
        "name": "The Blind Banker",
        "episode_number": 2,
        "vote_average": 7.351,
        "vote_count": 171
      },
      {
        "id": 578716,
        "name": "The Great Game",
        "episode_number": 3,
        "vote_average": 8.159,
        "vote_count": 160
      }
    ],
    "2": [
      {
        "id": 578720,
        "name": "A Scandal in Belgravia",
        "episode_number": 1,
        "vote_average": 8.419,
        "vote_count": 186
      },
      {
        "id": 578719,
        "name": "The Hounds of Baskerville",
        "episode_number": 2,
        "vote_average": 7.748,
        "vote_count": 155
      },
      {
        "id": 578718,
        "name": "The Reichenbach Fall",
        "episode_number": 3,
        "vote_average": 8.721,
        "vote_count": 164
      }
    ],
    "3": [
      {
        "id": 578721,
        "name": "The Empty Hearse",
        "episode_number": 1,
        "vote_average": 7.6,
        "vote_count": 152
      },
      {
        "id": 578722,
        "name": "The Sign of Three",
        "episode_number": 2,
        "vote_average": 7.9,
        "vote_count": 149
      },
      {
        "id": 578723,
        "name": "His Last Vow",
        "episode_number": 3,
        "vote_average": 8.212,
        "vote_count": 144
      }
    ],
    "4": [
      {
        "id": 1234465,
        "name": "The Six Thatchers",
        "episode_number": 1,
        "vote_average": 6.796,
        "vote_count": 137
      },
      {
        "id": 1234466,
        "name": "The Lying Detective",
        "episode_number": 2,
        "vote_average": 8.355,
        "vote_count": 124
      },
      {
        "id": 1251091,
        "name": "The Final Problem",
        "episode_number": 3,
        "vote_average": 7.72,
        "vote_count": 82
      }
    ]
  }
}


*/
// Episode data for a show
export interface Episode {
  id: number;
  name: string;
  episode_number: number;
  vote_average: number;
  vote_count: number;
}

// Data for a show
export interface ShowData {
  show_id: string;
  episodes: {
    [season: string]: Episode[];
  };
}

const EpisodeChart: React.FC<{ showId: string }> = ({ showId }) => {
  const { data, loading, error } = useFetch<ShowData>(`http://127.0.0.1:8000/show/{id}?show_id=${showId}`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  // Calculate the average rating for each season
  const seasons = Object.keys(data?.episodes || {});
  const categories = seasons.map(season => `Season ${season}`);
  const series = [{
    name: 'Average IMDB Rating',
    data: seasons.map(season => {
      const episodes = data?.episodes[season];
      const averageRating = episodes
        ? episodes.reduce((acc, episode) => acc + episode.vote_average, 0) / episodes.length
        : 0;
      return parseFloat(averageRating.toFixed(2)); // Round to two decimal places
    })
  }];

  // The chart options
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    colors: [function({ value, seriesIndex, w }: { value: any, seriesIndex: any, w: any }) {
      if (value < 5) {
          return '#7E36AF'
      } else {
          return '#D9534F'
      }
    }, function({ value, seriesIndex, w }: { value: any, seriesIndex: any, w: any }) {
      if (value < 111) {
          return '#7E36AF'
      } else {
          return '#D9534F'
      }
    }],
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      title: {
        text: 'IMDB Rating (0 - 10)'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} Rating`
      }
    }
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="bar"
      height={350}
    />
  );
};

export default EpisodeChart;
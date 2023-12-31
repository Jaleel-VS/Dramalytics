import React from 'react';
import './App.css';
import EpisodeChart from './components/charts/EpisodeColumnChart';
import EpisodeHeatMap from './components/charts/EpisodeHeatMap';

const App: React.FC = () => {
  // Replace '19885' with the actual show ID you want to display.
  return (
    <div className="App">
      <header className="App-header">
        {/* You can add a search input and other UI components here */}
      </header>
      <main>
        <EpisodeHeatMap showId="1399" />
        <EpisodeChart showId="1399" />
      </main>
    </div>
  );
}

export default App;
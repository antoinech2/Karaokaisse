import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

// Importer les composants de pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Credits from './pages/Credits';
import VideoPlayer from './pages/VideoPlayer';
import SearchPage from './pages/Research';
import SongsListPage from './pages/SongsListPage';

function App() {
  return (
    <Router>
      <div>
        {/* Définir les Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/video-player" element={<VideoPlayer />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/waiting-songs" element={<SongsListPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

// Importer les composants de pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Credits from './pages/Credits';

function App() {
  return (
    <Router>
      <div>
        {/* Liens de navigation */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/credits">Credits</Link></li>
          </ul>
        </nav>

        {/* Définir les Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './helpers/AuthContext';
import ProtectedRoute from './components/PrivateRoute';
import First from './pages/First';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Credits from './pages/Credits';
import VideoPlayer from './pages/VideoPlayer';
import SearchPage from './pages/Research';
import SongsListPage from './pages/SongsListPage';
import Page404 from './pages/page404';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<First />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Utiliser ProtectedRoute pour les pages nécessitant une authentification */}
          <Route path="/home" element={<ProtectedRoute component={Home} />} />
          <Route path="/search" element={<ProtectedRoute component={SearchPage} />} />
          <Route path="/waiting-songs" element={<ProtectedRoute component={SongsListPage} />} />
          <Route path="/video-player" element={<ProtectedRoute component={VideoPlayer} />} />

          <Route path="*" element={<Page404 />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

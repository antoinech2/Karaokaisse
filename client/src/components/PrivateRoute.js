import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../helpers/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuth();

  // Vérifie si l'utilisateur est authentifié
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si authentifié, affiche le composant passé en paramètre
  return <Component {...rest} />;
};

export default ProtectedRoute;

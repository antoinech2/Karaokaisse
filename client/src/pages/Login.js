import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../helpers/AuthContext';
import login from '../api/Login';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.endsWith('@imt-atlantique.net')) {
      setError('L\'adresse email doit se terminer par "@imt-atlantique.net".');
      return;
    }

    setError(''); // Réinitialise l'erreur

    try {
      const validAuth = await login(email, password);
      if (validAuth) {
        setAuthUser({ token: localStorage.getItem('token') }); // Met à jour l'état d'authentification dans AuthContext
        navigate('/home');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Connexion
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Adresse email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error && !email.endsWith('@imt-atlantique.net')}
            helperText={!!error && !email.endsWith('@imt-atlantique.net') ? error : ''}
          />
          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '16px' }}
          >
            Se connecter
          </Button>
          <Button
            variant="text"
            color="primary"
            fullWidth
            style={{ marginTop: '8px' }}
            onClick={() => navigate('/register')}
          >
            Créer un compte
          </Button>
          {error && (
            <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </form>
      </Box>
    </Container>
  );
}

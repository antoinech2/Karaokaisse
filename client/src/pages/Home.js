import React from 'react';
import { Container, Box, Button, Typography, Grid } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Link} from 'react-router-dom';
import { logout } from '../api/Login';

function Home() {
  //gestion de la déconnexion
  const handleLogout = () => {
    logout();
    window.location.reload();
  }
  
  return (
    <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
      {/* Logo de l'application */}
      <Box sx={{ mb: 4 }}>
        <MusicNoteIcon sx={{ fontSize: 80, color: 'primary.main' }} />
      </Box>

      {/* Titre de l'application */}
      <Typography variant="h4" component="h1" gutterBottom>
        Karaokaisse !!!
      </Typography>

      {/* Les boutons de navigation */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={8}>
          <Link to="/search" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 2 }}
            >
              Rechercher une chanson
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Link to="/waiting-songs" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ py: 2 }}
            >
              Voir les chansons en attente
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Link to="/credits" style={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ py: 2 }}
            >
              Crédits
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ py: 2 }}
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;

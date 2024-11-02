import React from 'react';
import { Container, Box, Button, Typography, Grid } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { Link } from 'react-router-dom';

function First() {
  
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
          <Link to="/home" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 2 }}
            >
              Se connecter
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ py: 2 }}
            >
              Créer un compte
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
}

export default First;

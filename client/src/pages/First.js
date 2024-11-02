import React from 'react';
import { Container, Box, Button, Typography, Grid } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

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
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 2 }}
            href="/Login"
          >
            Se connecter
          </Button>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ py: 2 }}
            href="/register"
          >
            Créer un compte
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default First;

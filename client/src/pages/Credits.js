import React from 'react';
import { Container, Box, Typography, Button, Grid, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Contact() {
  const navigate = useNavigate(); // Hook pour la navigation dans React Router

  // Fonction pour gérer le retour arrière
  const handleGoBack = () => {
    navigate(-1); // Navigue vers la page précédente
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center' }}>
      {/* Titre des crédits */}
      <Typography variant="h4" gutterBottom>
        Crédits
      </Typography>

      {/* Informations sur les créateurs */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Créateurs
        </Typography>
        <Typography variant="body1" gutterBottom>
          Cette application a été développée par une équipe passionnée de chant et de boisson.
        </Typography>
        <Typography variant="body1">
          Contactez-nous à :
          <Link href="mailto:contact@musicapp.com" underline="hover" sx={{ ml: 1 }}>
            cecinestpasunevraiadresse@imt-atlantique.net
          </Link>
        </Typography>
      </Box>

      {/* Informations supplémentaires */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Informations supplémentaires
        </Typography>
        <Typography variant="body1" gutterBottom>
          - Design inspiré par le Material Design de Google.
        </Typography>
        <Typography variant="body1" gutterBottom>
          - API Youtube utilisée pour rechercher et afficher des chansons.
        </Typography>
      </Box>

      {/* Bouton de retour arrière */}
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleGoBack}>
            Retour
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Contact;

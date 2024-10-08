import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Typography, List, ListItem, ListItemText, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import search from '../api/Search';

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate(); // Pour la navigation vers d'autres routes

  
  const searchVideos = (query) => {
    // Utiliser la fonction de recherche pour récupérer les vidéos
    search(query)
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching videos: ", error);
        setLoading(false);
      });
  };

  // Utiliser useEffect pour déclencher la recherche quand l'utilisateur tape
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      searchVideos(searchQuery);
    }, 500); // Délai de 500 ms avant de déclencher la recherche

    return () => clearTimeout(delayDebounceFn); // Nettoyage du timeout à chaque modification
  }, [searchQuery]); // useEffect se déclenche à chaque fois que searchQuery change

  // Fonction pour envoyer la vidéo sélectionnée au serveur (simulé)
  const handleProposeSong = () => {
    if (selectedVideo) {
      console.log("Proposition de la vidéo : ", selectedVideo);
      navigate('/'); // Retourner à la page d'accueil après avoir proposé la chanson
    }
  };

  // Fonction pour gérer la sélection d'une vidéo
  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
  };

  // Fonction pour revenir à la page précédente
  const handleGoBack = () => {
    navigate(-1); // Revenir à la page précédente
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Rechercher une chanson
      </Typography>

      {/* Champ de recherche */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Nom de la chanson"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {/* Loader pendant la recherche */}
      {loading && <CircularProgress size={24} />}

      {/* Liste des résultats'élément séléctionné reste en mode séléctionné */}
      {results.length > 0 && (
        <List sx={{ mt: 4 }}>
          {results.map((video, index) => (
            <ListItem
              button
              key={index}
              selected={selectedVideo && selectedVideo.id === video.id}
              onClick={() => handleSelectVideo(video)}
              sx={{
                backgroundColor: selectedVideo && selectedVideo.id === video.id ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
                borderRadius: '4px',
              }}
            >
              <ListItemText primary={video.title} secondary={video.artist} />
            </ListItem>
          ))}
        </List>
      )}

      {/* Bouton "Proposer cette chanson" */}
      {selectedVideo && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Chanson sélectionnée : {selectedVideo.title}
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleProposeSong}>
            Proposer cette chanson
          </Button>
        </Box>
      )}

      {/* Bouton de retour arrière */}
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <Grid item>
          <Button variant="outlined" color="primary" onClick={handleGoBack}>
            Retour
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SearchPage;

import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Typography, List, ListItem, ListItemText, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Données statiques pour simuler des résultats de recherche
const mockVideoData = [
  {
    id: "dQw4w9WgXcQ",
    title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    channelTitle: "Rick Astley",
  },
  {
    id: "3JZ_D3ELwOQ",
    title: "Charlie Puth - Attention [Official Video]",
    channelTitle: "Charlie Puth",
  },
  {
    id: "M7lc1UVf-VE",
    title: "YouTube Developers Live: Embedded Web Player Customization",
    channelTitle: "YouTube Developers",
  },
  {
    id: "9bZkp7q19f0",
    title: "PSY - GANGNAM STYLE(강남스타일) M/V",
    channelTitle: "officialpsy",
  },
  {
    id: "fLexgOxsZu0",
    title: "Ed Sheeran - Shape of You [Official Video]",
    channelTitle: "Ed Sheeran",
  },
];

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate(); // Pour la navigation vers d'autres routes

  // Fonction pour simuler une recherche avec des données statiques
  const searchVideos = (query) => {
    if (query === '') {
      setResults([]); // Si la recherche est vide, on n'affiche pas de résultats
    } else {
      // Filtrer les vidéos par le nom recherché
      const filteredVideos = mockVideoData.filter((video) =>
        video.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredVideos);
    }
    setLoading(false); // Désactiver l'état de chargement après la recherche
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

      {/* Liste des résultats */}
      {results.length > 0 && (
        <List sx={{ mt: 4 }}>
          {results.map((video, index) => (
            <ListItem
              button
              key={index}
              selected={selectedVideo && selectedVideo.id === video.id}
              onClick={() => handleSelectVideo(video)}
            >
              <ListItemText primary={video.title} secondary={video.channelTitle} />
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

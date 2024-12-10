import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, List, Grid, Button } from '@mui/material';
import SongItem from '../components/SongItem';
import { getPlaylist } from '../api/Playlist';
import { voteSongUp, deleteVote } from '../api/vote'; // Import des fonctions de vote

function SongsListPage() {
  const [songs, setSongs] = useState([]);

  // Charger les chansons depuis l'API
  const fetchSongs = async () => {
    try {
      const data = await getPlaylist();
      setSongs(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des chansons :', error.message);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // Fonction pour voter ou supprimer un vote
  const handleVote = async (id, value) => {
    try {
      const song = songs.find((s) => s.id === id);

      if (song && song.userVote === value) {
        // Si l'utilisateur clique à nouveau sur le même bouton, supprimer le vote
        await deleteVote(id);
      } else {
        // Sinon, soumettre un nouveau vote
        await voteSongUp(id, value);
      }

      await fetchSongs(); // Recharger les données après chaque action
    } catch (error) {
      console.error('Erreur lors du vote :', error.message);
    }
  };

  // Trier les chansons par score (du plus élevé au moins élevé)
  const sortedSongs = [...songs].sort((a, b) => b.score - a.score);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }} display="flex">
      <Typography variant="h4" gutterBottom>
        Liste des chansons proposées
      </Typography>

      {/* Liste des chansons */}
      <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
        <List>
          {sortedSongs.map((song, index) => (
            <SongItem
              key={song.id}
              song={song}
              onVote={(value) => handleVote(song.id, value)}
              isTop3={index < 3}
              position={index + 1}
            />
          ))}
        </List>
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          bgcolor: 'background.paper',
          p: 2,
          boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Grid container justifyContent="center" paddingTop={2}>
            <Grid item>
              <Link to="/home" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary">
                  Retour
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Box>
    </Container>
  );
}

export default SongsListPage;

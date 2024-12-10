import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Typography, List, ListItem, ListItemText, Grid, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import search from '../api/Search';
import { addSongToPlaylist } from '../api/Playlist';

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  const searchVideos = (query) => {
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      searchVideos(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleProposeSong = () => {
    if (selectedVideo) {
      console.log("Proposition de la vidéo : ", selectedVideo);
      try {
        addSongToPlaylist(selectedVideo.id);
        navigate('/home');
      } catch (error) {
        console.error("Error proposing song: ", error);
      }
    }
  };

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center', position: 'relative', pb: 10 }}>
      <Typography variant="h4" gutterBottom>
        Rechercher une chanson
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Nom de la chanson"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {loading && <CircularProgress size={24} />}

      <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 300px)', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
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

export default SearchPage;

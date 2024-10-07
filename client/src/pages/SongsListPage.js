import React, { useState } from 'react';
import { Container, Box, Typography, List, Grid } from '@mui/material';
import SongItem from '../components/SongItem';

const mockSongsData = [
  { id: 1, title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)', votes: 120 },
  { id: 2, title: 'Charlie Puth - Attention [Official Video]', votes: 95 },
  { id: 3, title: 'YouTube Developers Live: Embedded Web Player Customization', votes: 70 },
  { id: 4, title: 'PSY - GANGNAM STYLE(강남스타일) M/V', votes: 50 },
  { id: 5, title: 'Ed Sheeran - Shape of You [Official Video]', votes: 45 },
];

function SongsListPage() {
  const [songs, setSongs] = useState(mockSongsData);

  // Fonction pour voter "Up"
  const handleVoteUp = (id) => {
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === id ? { ...song, votes: song.votes + 1 } : song
      )
    );
  };

  // Fonction pour voter "Down"
  const handleVoteDown = (id) => {
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.id === id ? { ...song, votes: song.votes - 1 } : song
      )
    );
  };

  // Trier les chansons par nombre de votes (du plus voté au moins voté)
  const sortedSongs = [...songs].sort((a, b) => b.votes - a.votes);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Liste des chansons proposées
      </Typography>

      {/* Liste des chansons */}
      <Box sx={{ mt: 4 }}>
        <List>
          {sortedSongs.map((song, index) => (
            <SongItem
              key={song.id}
              song={song}
              onVoteUp={handleVoteUp}
              onVoteDown={handleVoteDown}
              isTop3={index < 3}
              position={index + 1}
            />
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default SongsListPage;

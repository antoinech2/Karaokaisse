import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

function SongItem({ song, onVote, isTop3, position }) {
  // Couleurs spéciales pour les chansons du top 3
  const getTop3Color = (position) => {
    switch (position) {
      case 1:
        return '#FFD700'; // Or
      case 2:
        return '#C0C0C0'; // Argent
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return 'transparent';
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        background: isTop3 ? getTop3Color(position) : 'white',
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={8}>
          <Typography variant="h6">{song.song.title}</Typography>
          <Typography variant="body2" color="textSecondary">
            Artiste : {song.song.artist}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Score : {song.score}
          </Typography>
        </Grid>

        {/* Boutons de vote */}
        <Grid item xs={4} container justifyContent="flex-end" spacing={1}>
          <Grid item>
            <Button
              variant="contained"
              color={song.userVote === 1 ? 'success' : 'primary'}
              onClick={() => onVote(1)}
            >
              <ThumbUpIcon sx={{ mr: 1 }} /> Up
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color={song.userVote === -1 ? 'error' : 'secondary'}
              onClick={() => onVote(-1)}
            >
              <ThumbDownIcon sx={{ mr: 1 }} /> Down
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SongItem;

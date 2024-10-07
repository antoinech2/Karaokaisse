import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useState, useEffect, useRef } from 'react';

function SongItem({ song, onVoteUp, onVoteDown, isTop3, position }) {
    const [downButtonWidth, setDownButtonWidth] = useState(0); // Stocker la largeur du bouton Down
    const downButtonRef = useRef(null); // Référence du bouton Down

  // Couleurs spéciales pour les chansons du top 3
  const getTop3Color = (position) => {
    switch (position) {
      case 1: return '#FFD700'; // Or
      case 2: return '#C0C0C0'; // Argent
      case 3: return '#CD7F32'; // Bronze
      default: return 'transparent'; // Pas de dégradé si au-delà de la 3ème place
    }
  };

    // Utiliser useEffect pour obtenir la largeur du bouton Down
    useEffect(() => {
        if (downButtonRef.current) {
          setDownButtonWidth(downButtonRef.current.offsetWidth);
        }
      }, []);

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
        {/* Titre de la chanson */}
        <Grid item xs={8}>
          <Typography variant="h6">{song.title}</Typography>
          <Typography variant="body2" color="textSecondary">
            Nombre de voix : {song.votes}
          </Typography>
        </Grid>

        {/* Boutons de vote */}
        <Grid item xs={4} container justifyContent="flex-end" spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              sx={{ width: `${downButtonWidth}px` }}
              onClick={() => onVoteUp(song.id)}
            >
              <ThumbUpIcon sx={{ mr: 1 }}/> Up
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              ref={downButtonRef}
              onClick={() => onVoteDown(song.id)}
            >
              <ThumbDownIcon sx={{ mr: 1 }}/> Down
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SongItem;

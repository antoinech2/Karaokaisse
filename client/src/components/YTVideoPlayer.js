import React, { useState } from 'react';
import YouTube from 'react-youtube';

const YouTubePlayer = () => {
  // Liste d'ID de vidéos YouTube à lire
  const videoIds = ['dQw4w9WgXcQ', '3JZ_D3ELwOQ', 'M7lc1UVf-VE']; // Ajoute tes vidéos ici
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Fonction appelée quand la vidéo est terminée
  const handleVideoEnd = () => {
    // Passe à la vidéo suivante
    if (currentVideoIndex < videoIds.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      setCurrentVideoIndex(0); // Retourne à la première vidéo si on est à la fin
    }
  };

  // Options pour le lecteur YouTube
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,  // Démarrer automatiquement
      controls: 1,  // Afficher les contrôles
      disablekb: 1, // Désactiver le clavier pour limiter les interactions
      rel: 0,       // Ne pas afficher de vidéos suggérées
      modestbranding: 1, // Désactiver le branding YouTube
      origin: window.location.origin // Nécessaire pour certaines intégrations
    },
  };

  return (
    <div>
      <YouTube
        videoId={videoIds[currentVideoIndex]}  // Vidéo à lire
        opts={opts}
        onEnd={handleVideoEnd}  // Appelée quand la vidéo est terminée
      />
      <p>Lecture de la vidéo {currentVideoIndex + 1} sur {videoIds.length}</p>
    </div>
  );
};

export default YouTubePlayer;

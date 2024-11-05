import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL;

// Propose une chanson à ajouter à la playlist
async function addSongToPlaylist(songId) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${serverUrl}/api/playlist`, {
        songId,
        });
        if (response.status === 200) {
            return true;
        } else {
            throw new Error('Erreur inconnue lors de l\'ajout de la chanson à la playlist.');
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                throw new Error('Il manque l\'ID de la chanson.');
            }
            if (error.response.status === 409) {
                throw new Error('La chanson est déjà dans la playlist.');
            }
            else {
                throw new Error('Erreur lors de l\'ajout de la chanson à la playlist.');
            }
        }
    }
}

//Propose une chanson à supprimer de la playlist
async function removeSongFromPlaylist(id) {
    try {
        const response = await axios.delete(`${serverUrl}/api/playlist`, {
        data: { id },
        });
        if (response.status === 200) {
            return true;
        } else {
            throw new Error('Erreur inconnue lors de la suppression de la chanson de la playlist.');
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                throw new Error('Il manque l\'ID de la chanson.');
            }
            if (error.response.status === 403) {
                throw new Error('Non autorisé.');
            }
            if (error.response.status === 404) {
                throw new Error('Chanson de la playlist non trouvée.');
            }
            if (error.response.status === 409) {
                throw new Error('La chanson n\'est pas en attente.');
            }
            else {
                throw new Error('Erreur lors de la suppression de la chanson de la playlist.');
            }
        }
    }
}

//recuperer la liste des chansons en attente dans la playlist
async function getPlaylist() {
    try {
        const response = await axios.get(`${serverUrl}/api/playlist`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Erreur inconnue lors de la récupération de la playlist.');
        }
    } catch (error) {
        throw new Error('Erreur lors de la récupération de la playlist.');
    }
}

//recupere la chanson en cours de lecture
async function getCurrentSong() {
    try {
        const response = await axios.get(`${serverUrl}/api/playlist/current`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Erreur inconnue lors de la récupération de la chanson en cours de lecture.');
        }
    } catch (error) {
        throw new Error('Erreur lors de la récupération de la chanson en cours de lecture.');
    }
}

//recupere la prochaine chanson à lire 
async function getNextSong() {
    try {
        const response = await axios.get(`${serverUrl}/api/playlist/next`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Erreur inconnue lors de la récupération de la prochaine chanson.');
        }
    } catch (error) {
        throw new Error('Erreur lors de la récupération de la prochaine chanson.');
    }
}

//propose la prochaine chanson à lire
async function proposeNextSong() {
    //TODO 
    // besoin de gérer la logique admin
}

export { addSongToPlaylist, removeSongFromPlaylist, getPlaylist, getCurrentSong, getNextSong, proposeNextSong };
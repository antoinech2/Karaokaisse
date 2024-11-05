import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL;

// soumettre un vote pour une chanson
async function voteSongUp(playlistSongId, value) {
    try {
        const response = await axios.post(`${serverUrl}/api/vote`, {
        playlistSongId,
        value
        });
        if (response.status === 200) {
            return true;
        } else {
            throw new Error('Erreur inconnue lors du vote pour la chanson.');
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                throw new Error('Il manque l\'ID de la chanson.');
            }
            if (error.response.status === 403) {
                throw new Error('Vote non autorisé. Besoin d\'être admin.');
            }
            if (error.response.status === 404) {
                throw new Error('Chanson non trouvée.');
            }
            if (error.response.status === 409) {
                throw new Error('La chanson n\'est pas en attente.');
            }
            else {
                throw new Error('Erreur lors du vote pour la chanson.');
            }
        }
    }
}

// supprimer un vote pour une chanson
async function deleteVote(playlistSongId) {
    try {
        const response = await axios.delete(`${serverUrl}/api/vote`, {
        data: { playlistSongId },
        });
        if (response.status === 200) {
            return true;
        } else {
            throw new Error('Erreur inconnue lors de la suppression du vote pour la chanson.');
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                throw new Error('Il manque l\'ID de la chanson.');
            }
            if (error.response.status === 404) {
                throw new Error('Chanson non trouvée.');
            }
            if (error.response.status === 409) {
                throw new Error('La chanson n\'est pas en attente.');
            }
            else {
                throw new Error('Erreur lors de la suppression du vote pour la chanson.');
            }
        }
    }
}
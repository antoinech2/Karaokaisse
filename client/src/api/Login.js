import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL;

async function login(email, password) {
  try {
    const response = await axios.post(`${serverUrl}/api/auth/login`, {
      email,
      password,
    });

    if (response.status === 200 && response.data.token) {
      localStorage.setItem('token', response.data.token);
      return true;
    } else {
      throw new Error('Erreur inconnue lors de la connexion.');
    }
  } catch (error) {
    if (error.response) {
      // Vérifie les erreurs spécifiques renvoyées par le serveur
      if (error.response.status === 401) {
        if (error.response.data.error === 'Username not registered') {
          throw new Error("L'adresse email n'est pas enregistrée.");
        } else if (error.response.data.error === 'Wrong password') {
          throw new Error("Mot de passe incorrect.");
        }
      }
      // Si une autre erreur survient
      throw new Error('Erreur lors de la connexion.');
    } else {
      throw new Error('Impossible de se connecter au serveur.');
    }
  }
}

function logout() {
  localStorage.removeItem('token');
}

export default {login, logout};

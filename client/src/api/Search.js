import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL;

//fonction search utilisée par la page reesearch pour demander au server la liste de chansons

async function search(query) {
    try {
        const response = await axios.get(`${serverUrl}/api/search`, {
            params: {
                q: query
            }
        });
        return response.data;
    } catch (error) {
        throw new Error("Error fetching songs");
    }
}

export default search;


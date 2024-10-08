const serverUrl = process.env.REACT_APP_SERVER_URL;

//fonction search utilisée par la page reesearch pour demander au server la liste de chansons

function search(query) {
    //utilisation de l'URL server contenue dans .env
    return fetch(`${serverUrl}/api/search?q=${query}`)
        .then((response) => {
        if (!response.ok) {
            throw new Error("Error fetching songs");
        }
        return response.json();
        });
    }

export default search;


import { PrismaClient } from "@prisma/client";
import Fuse from "fuse.js";
import logger from "../logger.js";

const prisma = new PrismaClient();

// Fonction pour normaliser les chaînes (supprimer les accents, mettre en minuscules)
function normalizeString(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

async function getAllSongs() {
    try {
        const songs = await prisma.songs.findMany(); // Récupérer toutes les chansons de la base de données
        songs.forEach((song) => {
            song.search = `${song.title} ${song.artist}`; // Ajouter une propriété de recherche
        })
        return songs;
    } catch (error) {
        logger.error("Erreur lors de la récupération des chansons :", error);
    }
}

async function searchSongs(query) {
    // Récupérer les chansons depuis la base de données SQLite
    const songs = await getAllSongs();

    // Options pour Fuse.js
    const options = {
        keys: ["search"], // Recherche sur les titres et artistes
        threshold: 0.3, // Ajuster la tolérance
        ignoreLocation: true,
        ignoreFieldNorm: true,
        useExtendedSearch: true,
    };

    // Initialiser Fuse.js avec les chansons récupérées
    const fuse = new Fuse(songs, options);

    // Normaliser la chaîne de recherche (pour gérer les accents et la casse)
    const normalizedQuery = normalizeString(query);

    // Effectuer la recherche
    const result = fuse.search(normalizedQuery);

    //console.log(result)
    // Afficher les résultats
    result.forEach(({ item }) => {
        console.log(`Titre : ${item.title}, Artiste : ${item.artist}`);
    });
}

// Exemple d'utilisation
searchSongs("guetta");

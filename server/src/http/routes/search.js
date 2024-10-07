import Fuse from "fuse.js";
import logger from "../../logger.js";
import { prisma } from "../app.js";
import express from "express";

const router = express.Router();

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
        });
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

    // Retourner les résultats limités à 10
    return result.slice(0, 10).map(({ item }) => {
        return {
            title: item.title,
            artist: item.artist,
            id: item.id,
        };
    });
}

router.get("/", async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    try {
        const results = await searchSongs(query);
        res.json(results);
    } catch (error) {
        logger.error("Erreur lors de la recherche des chansons :", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
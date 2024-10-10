import { prisma } from "../app.js";
import express from "express";
import logger from "../../logger.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
    const { playlistSong, value } = req.body;

    if (!playlistSong || !value) {
        return res.status(400).json({ error: "Missing playlist song or value" });
    }

    if (value !== 1 && value !== -1 && !req.isAdmin) {
        return res.status(403).json({ error: "Vote value unauthorized" });
    }

    try{
        const song = await prisma.playlist.findUnique({
            where: {
                id: playlistSong
            }
        });

        if (!song) {
            return res.status(404).json({ error: "Playlist song not found" });
        }

        if (song.status != "QUEUING"){
            return res.status(409).json({ error: "Playlist song is not queuing"})
        }
    } catch (error) {
        logger.error("Error fetching playlist song", error);
        res.status(500).json({ error: "Error fetching playlist song" });
    }

    try {
        const vote = await prisma.vote.upsert({
            where: {
                userId_playlistId: {
                    userId: req.userId,
                    playlistId: playlistSong,
                }
            },
            update:{
                value: value,
            },
            create: {
                value: value,
                playlistId: playlistSong,
                userId: req.userId
            },
        });

        res.json(vote);
    } catch (error) {
        logger.error("Error adding new vote", error);
        res.status(500).json({ error: "Error adding new vote" });
    }
});

router.delete("/", auth, async (req, res) => {
    const { playlistSong } = req.body;

    if (!playlistSong) {
        return res.status(400).json({ error: "Missing playlist song" });
    }

    try{
        const song = await prisma.playlist.findUnique({
            where: {
                id: playlistSong
            }
        });

        if (!song) {
            return res.status(404).json({ error: "Playlist song not found" });
        }

        if (song.status != "QUEUING"){
            return res.status(409).json({ error: "Playlist song is not queuing"})
        }
    } catch (error) {
        logger.error("Error fetching playlist song", error);
        res.status(500).json({ error: "Error fetching playlist song" });
    }


    let vote;
    try {
        vote = await prisma.vote.findFirst({
            where: {
                userId: req.userId,
                playlistId: playlistSong,
            },
        })    
    }
    catch (error) {
        logger.error("Error fetching vote", error);
        res.status(500).json({ error: "Error fetching vote" });
    }

    if (!vote) {
        return res.status(404).json({ error: "Vote not found" });
    }

    try {
        const vote = await prisma.vote.delete({
            where: {
                userId_playlistId: {
                    userId: req.userId,
                    playlistId: playlistSong,
                }
            },
        });

        res.json(vote);
    } catch (error) {
        logger.error("Error deleting vote", error);
        res.status(500).json({ error: "Error deleting vote" });
    }
});

export default router;
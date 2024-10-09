import { prisma } from "../app.js";
import express from "express";
import logger from "../../logger.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { playlistSong, value } = req.body;

    if (!playlistSong || !value) {
        return res.status(400).json({ error: "Missing playlist song or value" });
    }

    // TODO : Check value is -1 or 1 or Admin

    try {
        const vote = await prisma.vote.upsert({
            where: {
                userId_playlistId: {
                    userId: 1, // TODO : Replace with the actual user ID
                    playlistId: playlistSong,
                }
            },
            update:{
                value: value,
            },
            create: {
                value: value,
                playlistId: playlistSong,
                userId: 1, // TODO : Replace with the actual user ID
            },
        });

        res.json(vote);
    } catch (error) {
        logger.error("Error adding new vote", error);
        res.status(500).json({ error: "Error adding new vote" });
    }
});

router.delete("/", async (req, res) => {
    const { playlistSong } = req.body;

    if (!playlistSong) {
        return res.status(400).json({ error: "Missing playlist song" });
    }

    let vote;
    try {
        vote = await prisma.vote.findFirst({
            where: {
                userId: 1, // TODO : Replace with the actual user ID
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
                    userId: 1, // TODO : Replace with the actual user ID
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
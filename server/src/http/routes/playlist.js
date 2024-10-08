import { prisma } from "../app.js";
import express from "express";
import logger from "../../logger.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { id } = req.body;

    try {
        const newSong = await prisma.playlist.create({
            data: {
                songId: id,
                // TODO: Replace with the actual user ID
                userId: 1,
            },
        });

        res.json(newSong);
    } catch (error) {
        res.status(500).json({ error: "Error creating song" });
    }
});

router.get("/", async (req, res) => {
    try {
        const songs = await prisma.playlist.findMany({
            include: {
                song: true,
                user: {
                    select: {
                        name: true,
                    },
                },
                Vote: {
                    select: {
                        value: true,
                    },
                },
            },
        });

        songs.forEach((song) => {
            song.positiveVoteCount = song.Vote.reduce((acc, vote) => acc + (vote.value > 0 ? vote.value : 0), 0);
            song.negativeVoteCount = song.Vote.reduce((acc, vote) => acc + (vote.value < 0 ? -vote.value : 0), 0);
            song.score = song.positiveVoteCount - song.negativeVoteCount;
            song.Vote = undefined;
        });

        res.json(songs);
    } catch (error) {
        logger.error("Error fetching songs", error);
        res.status(500).json({ error: "Error fetching songs" });
    }
});

export default router;
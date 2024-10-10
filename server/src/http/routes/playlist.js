import { prisma } from "../app.js";
import express from "express";
import logger from "../../logger.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
    const { songId } = req.body;

    if (!songId) {
        return res.status(400).json({ error: "Missing song ID" });
    }

    const existingSong = await prisma.playlist.findFirst({
        where: {
            songId,
        },
    });

    if (existingSong) {
        return res.status(409).json({ error: "Song already in playlist", status: existingSong.status });
    }

    try {
        const newSong = await prisma.playlist.create({
            data: {
                songId,
                // TODO: Replace with the actual user ID
                userId: req.userId,
            },
        });

        res.json(newSong);
    } catch (error) {
        res.status(500).json({ error: "Error creating song" });
    }
});

router.delete("/", auth, async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "Missing song ID" });
    }

    if (!req.isAdmin){
        return res.status(403).json({ error: "Unauthorized" });
    }

    try {

        const song = await prisma.playlist.findUnique({
            where: {
                id
            }
        });

        if (!song) {
            return res.status(404).json({ error: "Playlist song not found" });
        }

        if (song.status != "QUEUING") {
            return res.status(409).json({ error: "Song is not in queuing status" });
        }

        const deletedSong = await prisma.playlist.update({
            where: {
                id
            },
            data: {
                status: "DISCARDED",
            },
        });

        res.json(deletedSong);
    } catch (error) {
        res.status(500).json({ error: "Error deleting song" });
    }
});


async function getSongsWithScore(status){
    const songs = await prisma.playlist.findMany({
        where: {
            status: status,
        },
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

    return songs
}


router.get("/", async (req, res) => {
    try {
        res.json(await getSongsWithScore("QUEUING"));
    } catch (error) {
        logger.error("Error fetching songs", error);
        res.status(500).json({ error: "Error fetching songs" });
    }
});

router.get("/next", async (req, res) => {
    try {
        const songs = await getSongsWithScore("NEXT");

        if (songs.length === 0) {
            return res.status(404).json({ error: "No song in next status" });
        }

        res.json(songs[0]);
    } catch (error) {
        logger.error("Error fetching next song", error);
        res.status(500).json({ error: "Error fetching next song" });
    }
});

router.post("/next", auth, async (req, res) => {

    if (!req.isAdmin){
        return res.status(403).json({ error: "Unauthorized" });
    }

    async function nextSong(){
        try {
            const songs = await getSongsWithScore("QUEUING");
            const song = songs.reduce((prev, current) => (prev.score > current.score ? prev : current), songs[0]);

            /*
            if (!song) {
                return res.status(404).json({ error: "No song in queuing status" });
            }
            */

            const updatedSongPlayed = await prisma.playlist.updateMany({
                where: {
                    status: "PLAYING",
                },
                data: {
                    status: "PLAYED",
                },
            });

            const updatedSongPlaying = await prisma.playlist.updateMany({
                where: {
                    status: "NEXT",
                },
                data: {
                    status: "PLAYING",
                },
            });

            if (!song && updatedSongPlaying.count != 1){
                return res.status(404).json({ error: "No song to play" });
            }

            if (song){
                const result = await prisma.playlist.update({
                    where: {
                        id: song.id,
                    },
                    data: {
                        status: "NEXT",
                    },
                });    

                if (!result || !updatedSongPlayed || !updatedSongPlaying) {
                    return res.status(500).json({ error: "Error while updating next song status" });
                }

                res.json(song);
            } else {
                res.json({ warning: "No song to play" });
            }

            if (updatedSongPlaying.count != 1){
                nextSong();
            }

        } catch (error) {
            logger.error("Error fetching next song", error);
            res.status(500).json({ error: "Error fetching next song" });
        }
    }

    await nextSong();
});


export default router;
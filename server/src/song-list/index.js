import config from "../../config/channels.json" assert { type: "json" };
import logger from "../logger.js";
import fs, { stat } from "fs";
import axios from "axios";
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const filePath = "data/status.json"

const regex = [{regex: /^(.+)\s-\s(.+?)\s\|.*$/, title: 1, artist: 2}, 
    {regex: /^Karaok(?:é|e)\s(.+)\s-\s(.+?)\s\*$/, title: 1, artist: 2},
    {regex: /^(.+?)\s-\s(.+)\s\(Karaoke\sVersion\)$/, title: 2, artist: 1},
    {regex: /^(.+?) in the style of (.+) \| Karaoke with Lyrics$/, title: 1, artist: 2},
    {regex: /^(.+?) - (.+) \(Karaoke .+$/, title: 2, artist: 1},
    {regex: /^Karaoké\s*-\s*(.+?)\s*-\s*(.+)$/, title: 2, artist: 1},
];

function updateSongList() {
    logger.info("Updating database with song list");

    if (!config.length > 0) {
        logger.error("No channels found in config");
        return;
    }

    if (!process.env.API_KEY) {
        logger.error("No Youtube API key found in environment variables");
        return;
    }

    let status

    if (fs.existsSync(filePath)) {
        try {
            // Lire le fichier
            const fileContent = fs.readFileSync(filePath, "utf8");

            // Parser le contenu en JSON
            status = JSON.parse(fileContent);

            // Afficher les données
            console.log("Found status file, resuming from last state...");
        } catch (error) {
            logger.error(
                "Error loading status file",
                error
            );
            return;
        }
    } else {
        logger.info("No status file found, starting from scratch...");

        status = {};

        logger.info("Default status file created");
    }

    config.forEach((channel) => {
        if (!status[channel]){
            status[channel] = {
                started: false,
                finished: false,
            }
        }
    });
    saveStatus(status)

    // Pour chaque channel
    Object.entries(status).forEach(async ([id, channel]) => {
        logger.debug(`Processing channel ${id}`);
        if (!channel.started && !channel.finished){
            await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${id}&key=${process.env.API_KEY}`)
                .then(res => {
                    const playlistId = res.data.items[0].contentDetails.relatedPlaylists.uploads;
                    logger.info(`Playlist ID for channel ${id} is ${playlistId}`);
                    status[id].started = true;
                    status[id].playlistId = playlistId;
                    saveStatus(status);
                })
                .catch(err => {
                    console.log("t", err.request)
                    logger.error(`Error fetching playlist ID for channel ${id}`, err, err.request)
                    return
                });
        }

        while (channel.started && !channel.finished){
            await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${channel.playlistId}&key=${process.env.API_KEY}&maxResults=50&${channel.nextPageToken ? `pageToken=${channel.nextPageToken}` : ""}`)
                .then(async res => {
                    const videos = res.data.items;

                    await videos.forEach(async video => {
                        let match = null;
                        let regexId = -1
                        while ((!match || match.length < 3) && regexId < regex.length -1) {
                            regexId++
                            match = video.snippet.title.match(regex[regexId].regex)
                        }
                        if (!match || match.length < 3) {
                            logger.warn(`Unable to match video title with regex (${video.snippet.title}). Video id: ${video.snippet.resourceId.videoId}`);
                            return;
                        }
                        try {
                            const song = await prisma.songs.findFirst({
                                where: {
                                    videoId: video.snippet.resourceId.videoId
                                }
                            })
                            if (song) {
                                logger.info(`Song ${song.videoId} (${song.title}) already in database`);
                                return;
                            }
                            else {
                                await prisma.songs.create({
                                    data: {
                                        videoId: video.snippet.resourceId.videoId,
                                        title: match[regex[regexId].title],
                                        artist: match[regex[regexId].artist],
                                        channel: id,
                                        publishedAt: video.snippet.publishedAt
                                    }
                                })    
                            }
                        } catch (err) {
                            logger.warn(err)
                        }
                        
                    })

                    if (res.data.nextPageToken){
                        const nextPageToken = res.data.nextPageToken;
                        status[id].nextPageToken = nextPageToken;
        
                        logger.info(`Treated ${videos[videos.length -1].snippet.position}/${res.data.pageInfo.totalResults} videos for channel ${id}`);
                    } else{
                        status[id].finished = true;
                        logger.info(`Finished treating videos for channel ${id}`);
                    }
                    saveStatus(status);    
                })
                .catch(err => {
                    logger.error(`Error fetching videos for channel ${id}`, err)
                    return
                });
            await sleep(250)
        }

    });
    logger.info("End.");

}

function saveStatus(status) {
    fs.writeFileSync(filePath, JSON.stringify(status, null, 4));
}

function sleep(ms) {  
    return new Promise(resolve => setTimeout(resolve, ms));  
}  

updateSongList();

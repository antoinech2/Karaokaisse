import { iso8601ToSeconds, iso8601toString } from "./videoDuration.js";
import axios from "axios";

export default async function getVideoDetails(videoId){
    try {

        const details = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoId}&key=${process.env.API_KEY}`);

        if (details.data.items.length != 0) {
            const durationString = iso8601toString(details.data.items[0].contentDetails.duration);
            const duration = iso8601ToSeconds(details.data.items[0].contentDetails.duration);
            const viewCount = details.data.items[0].statistics.viewCount;
            return { durationString, duration, viewCount }
        }
        else {
            return {}
        }
    }
    catch (error) {
        logger.error("Error fetching video details : ", error);
        return {}
    }
}

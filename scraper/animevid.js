const axios = require('axios');

exports.config = {
    name: 'animevid',
    author: 'AceGerome',
    description: 'Fetches a random anime video from TikTok',
    category: 'social',
    link: ['/animevid']
};

exports.initialize = async function ({ req, res }) {
    const tikTokUserIds = [
        '6850681469859628034',
        '7184871063795352603',
        '6957010568603829254',
        '7033020341324809242',
        '6954581066443736069',
        '7219084932340679686',
        '6822271197663036422'
    ];
    const RAPIDAPI_KEY = 'ece5655ae3msh55483dd9d60402fp12e36ajsn5adc6b59bc68';
    const RAPIDAPI_HOST = 'tiktok-scraper7.p.rapidapi.com';

    try {
        const videos = await fetchTikTokUsersVideos(tikTokUserIds, RAPIDAPI_KEY, RAPIDAPI_HOST);
        
        if (!videos || videos.length === 0) {
            return res.json({ message: 'No anime videos found.' });
        }

        const randomVideo = videos[Math.floor(Math.random() * videos.length)];

        const videoStream = await getStreamFromURL(randomVideo.play);
        res.setHeader('Content-Type', 'video/mp4');
        videoStream.pipe(res);

    } catch (error) {
        console.error("Error fetching anime video:", error);
        res.status(500).json({ error: "An error occurred while processing your request. Please try again later." });
    }
};

async function fetchTikTokUsersVideos(userIds, apiKey, apiHost) {
    const allVideos = [];
    
    for (const userId of userIds) {
        const videos = await fetchTikTokUserVideos(userId, apiKey, apiHost);
        if (Array.isArray(videos)) { 
            allVideos.push(...videos);
        }
    }
    
    return allVideos;
}

async function getStreamFromURL(url) {
    const response = await axios.get(url, { responseType: 'stream' });
    return response.data;
}

async function fetchTikTokUserVideos(userId, apiKey, apiHost) {
    const options = {
        method: 'GET',
        url: 'https://tiktok-scraper7.p.rapidapi.com/user/posts',
        params: { user_id: userId, count: '300' },
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': apiHost,
        },
    };

    try {
        const response = await axios.request(options);
        if (response.data && response.data.data && Array.isArray(response.data.data.videos)) {
            return response.data.data.videos; 
        } else {
            console.error(`No videos found for user ${userId}.`);
            return [];
        }
    } catch (error) {
        console.error(`Error fetching videos for user ${userId}:`, error);
        return [];
    }
}

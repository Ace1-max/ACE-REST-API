const axios = require('axios');

exports.config = {
    name: 'tiktokdl',
    author: 'Ace Gerome',
    description: 'Retrieve TikTok video',
    category: 'tools',
    link: ['/tiktokdl?url=https://vt.tiktok.com/ZGJBQHoHA/']
};

exports.initialize = async function ({ req, res, logs }) {
    try {
        const videoUrl = req.query.url;

        if (!videoUrl) {
            return res.status(400).json({
                status: false,
                creator: 'Ace Gerome',
                message: "Missing video URL"
            });
        }

        // API request options
        const options = {
            method: 'GET',
            url: 'https://tiktok-download-video-no-watermark.p.rapidapi.com/tiktok/info',
            params: { url: videoUrl },
            headers: {
                'x-rapidapi-key': '3e5f7270c4msh8a6f1a971496541p132b65jsn2cbd0adfc28f',
                'x-rapidapi-host': 'tiktok-download-video-no-watermark.p.rapidapi.com'
            }
        };

        // Request video data from RapidAPI
        const response = await axios.request(options);
        const videoData = response.data;

        res.status(200).json({
            status: true,
            creator: 'Ace Gerome',
            videoData
        });
        
    } catch (error) {
        console.error("Error fetching TikTok video info:", error);
        res.status(500).json({
            status: false,
            creator: 'Ace Gerome',
            message: "Failed to retrieve video information"
        });
    }
};


const axios = require('axios');

exports.config = {
    name: 'animevid',
    author: 'Ace',
    description: 'Fetches a random anime video from TikTok',
    category: 'social',
    link: ['/animevid']
};

exports.initialize = async function ({ req, res }) {
    try {
        const tikTokUserIds = [
            '6850681469859628034', 
            '7184871063795352603', 
            '6957010568603829254', 
            '7033020341324809242', 
            '6954581066443736069',
            '7219084932340679686',
            '6822271197663036422'
        ];

        const videos = await fetchTikTokUsersVideos(tikTokUserIds);

        if (!videos || videos.length === 0) {
            return res.status(404).json({ error: 'No anime videos found.' });
        }

        const randomVideo = videos[Math.floor(Math.random() * videos.length)];

        const importantDetails = {
            author: "AceGerome",
            videoId: randomVideo.video_id,
            title: randomVideo.title,
            cover: randomVideo.cover,
            playUrl: randomVideo.play,
            user: {
                nickname: randomVideo.author.nickname,
                avatar: randomVideo.author.avatar
            },
            playCount: randomVideo.play_count,
            diggCount: randomVideo.digg_count,
            commentCount: randomVideo.comment_count,
            shareCount: randomVideo.share_count,
            downloadCount: randomVideo.download_count
        };

        return res.json(importantDetails);
    } catch (error) {
        console.error("Error fetching anime video:", error);
        return res.status(500).json({ error: 'An error occurred while fetching anime videos.' });
    }
};

async function fetchTikTokUsersVideos(userIds) {
    const allVideos = [];

    for (const userId of userIds) {
        const videos = await fetchTikTokUserVideos(userId);
        if (videos) {
            allVideos.push(...videos);
        }
    }

    return allVideos;
}

async function fetchTikTokUserVideos(userId) {
    const options = {
        method: 'GET',
        url: 'https://tiktok-scraper7.p.rapidapi.com/user/posts',
        params: {
            user_id: userId,
            count: '300',
        },
        headers: {
            'X-RapidAPI-Key': 'ece5655ae3msh55483dd9d60402fp12e36ajsn5adc6b59bc68',
            'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com',
        },
    };

    try {
        const response = await axios.request(options);
        return response.data.data.videos || [];
    } catch (error) {
        console.error(`Error fetching videos for user ${userId}:`, error);
        return [];
    }
}

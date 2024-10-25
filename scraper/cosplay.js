const axios = require('axios');

exports.config = {
    name: 'Shoti',
    author: 'Ace Gerome',
    description: 'Generate random Shoti videos',
    category: 'Social',
    link: ['/shoti']
};

exports.initialize = async function ({ req, res, log }) {
    try {
        const { data } = await axios.get(`https://shoti-server-v2.onrender.com/api/v1/request-f`);

        res.json({
          code: data.code,
          status: data.message,
          response: {
            region: data.data?.region || "Unknown",
            url: data.data?.url || "URL not available",
            title: data.data?.title || "No title",
            username: data.data?.user?.username || "Unknown user",
            nickname: data.data?.user?.nickname || "No nickname"
          }
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ 
            error: "Failed to fetch data from the API" 
        });
    }
};

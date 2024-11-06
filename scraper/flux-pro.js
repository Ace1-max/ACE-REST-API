const axios = require('axios');

exports.config = {
    name: 'FLUX-pro',
    author: 'AceGerome',
    description: 'Image Generation with model of FLUX-pro',
    category: 'image generation',
    link: ['/FLUX-pro?prompt=']
};

exports.initialize = async function ({ req, res }) {
    const { prompt } = req.query;

    if (!prompt) {
        return res.status(400).json({ error: 'The "prompt" parameter is required' });
    }

    try {
        const payload = { prompt };

        const response = await axios.post('https://api.deepinfra.com/v1/inference/black-forest-labs/FLUX-pro', payload, {
            headers: {
                'Authorization': 'Bearer ${global.config.apikey}',
                'Content-Type': 'application/json'
            }
        });

        if (!response.data || !response.data.image_url) {
            return res.status(500).json({ error: 'Unexpected response format from the API' });
        }

        res.json({
            inference_status: response.data.inference_status || 'Unknown',
            status: response.data.status || 'Unknown',
            image_url: response.data.image_url
        });
    } catch (error) {
        if (error.response) {
            console.error("Error Response:", error.response.data);
            return res.status(error.response.status).json({ error: error.response.data.message || 'Error from external API' });
        } else if (error.request) {
            console.error("Error Request:", error.request);
            return res.status(503).json({ error: 'No response received from the API. Please try again later.' });
        } else {
            console.error("Error:", error.message);
            return res.status(500).json({ error: 'Internal Server Error: ' + error.message });
        }
    }
};

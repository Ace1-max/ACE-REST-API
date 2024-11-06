const axios = require('axios');

exports.config = {
    name: 'FLUX-1-schnell',
    author: 'AceGerome',
    description: 'Image Generation with FLUX-1-schnell model',
    category: 'image generation',
    link: ['/FLUX-1-schnell?prompt=']
};

exports.initialize = async function ({ req, res }) {
    const { prompt } = req.query;
    if (!prompt) {
        return res.status(400).json({ error: 'The "prompt" parameter is required' });
    }

    try {
        const payload = { prompt };

        const { data } = await axios.post('https://api.deepinfra.com/v1/inference/black-forest-labs/FLUX-1-schnell', payload, {
            headers: {
                'Authorization': 'Bearer ${global.config.apikey}',
                'Content-Type': 'application/json'
            }
        });

        if (!data.images || data.images.length === 0) {
            return res.status(404).json({ error: 'No images generated' });
        }

        const imageBuffer = Buffer.from(data.images[0].split(',')[1], 'base64');

        res.set('Content-Type', 'image/png');
        res.set('Content-Length', imageBuffer.length);

        res.send(imageBuffer);
    } catch (error) {
        console.error("Error:", error);
        if (error.response) {
            return res.status(error.response.status).json({ error: error.response.data });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

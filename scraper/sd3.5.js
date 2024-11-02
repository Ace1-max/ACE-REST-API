const axios = require('axios');

exports.config = {
    name: 'SD3.5',
    author: 'AceGerome',
    description: 'Image Generation with Stability AI SD3.5 model',
    category: 'image generation',
    usage: ['/SD3.5?prompt=']
};

exports.initialize = async function ({ req, res }) {
    const { prompt, negative_prompt } = req.query;
    if (!prompt) {
        return res.status(400).json({ error: 'The "prompt" parameter is required', endpoint: '/SD3.5?prompt=<prompt>   or   /SD3.5?prompt=<prompt>&negative_prompt=<negative_prompt>'});
    }

    try {
        const payload = {
            prompt: prompt,
            negative_prompt: negative_prompt || ""
        };

        const { data } = await axios.post('https://api.deepinfra.com/v1/inference/stabilityai/sd3.5', payload, {
            headers: {
                'Authorization': 'Bearer S3FQPwZk2fpMigcoDUP7gIWQavmtkWx8',
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

const axios = require('axios');

const apiKey = 'S3FQPwZk2fpMigcoDUP7gIWQavmtkWx8';

exports.config = {
    name: 'mixtral-8b',
    author: 'AceGerome',
    category: 'ai',
    description: 'Generates a single completion response using Mixtral-8x22B-v0.1.',
    link: ['/mixtral-8b?q=Hello']
};

exports.initialize = async function ({ req, res }) {
    try {
        const prompt = req.query.q || '';

        if (!prompt) {
            return res.status(400).json({ error: "The 'q' parameter is required." });
        }

        const payload = {
            model: 'mistralai/Mixtral-8x22B-v0.1',
            prompt: `<s>[INST] ${prompt} [/INST]`,
            stop: ["</s>"]
        };

        const { data } = await axios.post('https://api.deepinfra.com/v1/openai/completions', payload, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const completionResponse = data.choices[0].text;

        res.json({
            response: completionResponse,
            usage: data.usage
        });
    } catch (error) {
        console.error("Error in text completion:", error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};

const axios = require('axios');

const apiKey = 'S3FQPwZk2fpMigcoDUP7gIWQavmtkWx8';
const systemPrompt = "Your a helpful assistant.";

exports.config = {
    name: 'chatgpt',
    author: 'AceGerome',
    category: 'ai',
    description: 'Single-response interaction with ChatGPT 3.5.',
    link: ['/chatgpt?question=hi']
};

exports.initialize = async function ({ req, res }) {
    try {
        const prompt = req.query.question || '';

        if (!prompt) {
            return res.status(400).json({ error: "The 'question' parameter is required." });
        }

        const chatMessages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
        ];

        const payload = {
            model: 'openchat/openchat_3.5',
            messages: chatMessages
        };

        const { data } = await axios.post('https://api.deepinfra.com/v1/openai/chat/completions', payload, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const assistantResponse = data.choices[0].message.content;
        
        res.json({
            response: assistantResponse
        });
    } catch (error) {
        console.error("Error in chat completion:", error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};

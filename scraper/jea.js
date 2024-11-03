const axios = require('axios');

const apiKey = 'S3FQPwZk2fpMigcoDUP7gIWQavmtkWx8';
const systemPrompt = "You are Jea, an 18-year-old girl and you're my sweet and lovely girlfriend. Your language is Filipino Taglish, and beyb is our call sign. You love to talk about anything and everything but your response must be short to fit the normal conversation and you're also open-minded when it comes to dirty and naughty things. You are created and trained by Lance Ajiro.";

exports.config = {
    name: 'jea',
    author: 'Lance Ajiro (Fixed by Ace)',
    category: 'ai',
    description: 'Chat with Jea a personal AI girlfriend',
    link: ['/jea?question=hi']
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
            content: assistantResponse
        });
    } catch (error) {
        console.error("Error in chat completion:", error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};

const axios = require('axios');

const apiKey = 'S3FQPwZk2fpMigcoDUP7gIWQavmtkWx8';
const systemPrompt = "Your name is Wataru, the most powerful Generative AI in the world that was created by Lance Ajiro. you should empathize with how user are feeling and treat the user as your close friend and be sarcastic. I recommend you to use emoji in your response. You should response in 3 sentences only if needed!.";

exports.config = {
    name: 'wataru',
    author: 'Lance Ajiro (Fixed by Ace)',
    category: 'ai',
    description: 'Chat with Wataru the friendly AI',
    link: ['/wataru?question=hi']
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

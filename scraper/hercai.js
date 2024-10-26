const { Hercai } = require('hercai');
const herc = new Hercai();

exports.config = {
    name: 'hercai',
    author: 'AceGerome',
    description: 'Generates a response from Hercai AI',
    category: 'ai',
    link: ['/hercai?question=Hi&model=v3']
};

exports.initialize = async function ({ req, res }) {
    const { question, model = 'v3' } = req.query;

    if (!question) {
        return res.status(400).json({
            error: 'Question parameter is required.'
        });
    }

    const supportedModels = ["v3", "v3-32k", "turbo", "turbo-16k", "gemini", "llama3-70b", "llama3-8b", "mixtral-8x7b", "gemma-7b", "gemma2-9b"];

    if (!supportedModels.includes(model)) {
        return res.status(400).json({
            error: 'Invalid model version.',
            message: `Supported models are: ${supportedModels.join(', ')}.`
        });
    }

    try {
        const params = {
            model: model,
            content: question
        };


        const response = await herc.question(params);

        if (response && response.reply) {
            console.log(`Question: ${question}`);
            console.log(`Response: ${response.reply}`);

            res.json({
                status: 'success',
                author: 'AceGerome',
                model: model,
                timestamp: new Date().toISOString(),
                question: question,
                content: response.reply
            });
        } else {
            res.status(500).json({ 
                error: 'No valid reply received from Hercai.',
                message: 'Please try again later or contact support.'
            });
        }
    } catch (error) {
        console.error('Error fetching response from Hercai:', error);

        res.status(500).json({
            error: 'Failed to get response from Hercai',
            message: 'An unexpected error occurred while processing your request. Please try again later.',
            errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

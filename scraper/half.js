const axios = require('axios');
const fs = require('fs');
const path = require('path');

exports.config = {
    name: "half-illustration",
    author: "AceGerome",
    description: "Generate a half illustration based on the provided text.",
    category: "image generation",
    link: "/half-Illustration?prompt=",
};

async function half(q) {
    const url = "https://api-inference.huggingface.co/models/davisbro/half_illustration";
    const headers = {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36",
        "Referer": `https://huggingface.co/davisbro/half_illustration?text=${encodeURIComponent(q)}`,
        "Content-Type": "application/json",
        // Uncomment and add your API key if required
        // "Authorization": `Bearer YOUR_API_KEY`, 
    };

    const body = {
        inputs: q
    };

    try {
        const response = await axios.post(url, body, {
            headers: headers,
            responseType: 'arraybuffer'
        });

        if (response.status !== 200) {
            console.error(`Request failed with status ${response.status}: ${response.statusText}`);
            return null;
        }

        return Buffer.from(response.data);
    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}

exports.initialize = async function ({ req, res }) {
    const { prompt } = req.query;

    if (!prompt) {
        return res.status(400).json({ 
            status: "error",
            author: "AceGerome", 
            error: 'The "prompt" parameter is required.' 
        });
    }

    const dir = path.join(__dirname, "tmp");
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const img = await half(prompt);
    if (img) {
        const filePath = path.join(dir, "hf.png");
        fs.writeFileSync(filePath, img);
        
        return res.sendFile(filePath, () => {
            fs.unlinkSync(filePath); 
        });
    } else {
        return res.status(500).json({ 
            status: "error",
            author: "AceGerome",
            error: "Failed to generate image." 
        });
    }
};

const { Goodbye2 } = require('knights-canvas');
const fs = require('fs').promises;
const path = require('path');

exports.config = {
    name: 'goodbye',
    author: 'Lance Cochangco',
    description: 'Generate a goodbye image',
    category: 'canvas',
    link: ['/goodbye?pp=https://i.imgur.com/xwCoQ5H.jpeg&nama=Lance&bg=https://i.ibb.co/4YBNyvP/images-76.jpg&member=25']
};

exports.initialize = async function ({ req, res }) {
    try {
        const pp = req.query.pp;
        const nama = req.query.nama;
        const bg = req.query.bg;
        const member = req.query.member;

        if (!pp || !nama || !bg || !member) {
            return res.status(400).json({
                status: false,
                creator: 'Lance Cochangco',
                message: "Missing data to execute the command"
            });
        }

        // Generate the canvas
        const goodbyeCanvas = await new Goodbye2()
            .setAvatar(pp)
            .setUsername(nama)
            .setBg(bg)
            .setMember(member)
            .toAttachment();

        const data = goodbyeCanvas.toBuffer();
        const filePath = path.join(__dirname, 'tmp', 'goodbye.png');

        // Ensure 'tmp' directory exists
        await fs.mkdir(path.join(__dirname, 'tmp'), { recursive: true });

        // Write file to temp directory
        await fs.writeFile(filePath, data);

        // Send the file
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error("Error sending the file:", err);
                res.status(500).json({ error: "Failed to send file" });
            }

            // Clean up the file after sending
            fs.unlink(filePath).catch((err) =>
                console.error("Error deleting temp file:", err)
            );
        });
    } catch (error) {
        console.error("Error generating goodbye canvas:", error);
        res.status(500).json({ error: "Failed to generate canvas" });
    }
};

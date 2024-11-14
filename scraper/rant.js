const axios = require("axios");

exports.config = {
  name: "rant",
  description: "Retrieve posts based on recipient and pagination parameters",
  author: "AceGerome",
  category: "social",
  link: ["/rant?q=&page=1"]
};

exports.initialize = async function ({ req, res }) {
  const query = req.query.q;
  const page = req.query.page || 1;
  const limit = 5;

  if (!query) {
    return res.status(400).json({
      status: "error",
      message: "The 'q' parameter is required."
    });
  }

  try {
    const response = await axios.get(`https://api.sendthesong.xyz/api/posts`, {
      params: {
        q: query,
        page,
        limit
      }
    });

    if (response.data.status !== "success") {
      return res.status(500).json({
        status: "error",
        message: "Failed to retrieve posts from the external API."
      });
    }

    const data = response.data.data.map(post => ({
      recipient: post.recipient,
      message: post.message,
      song_link: `https://open.spotify.com/track/${post.song_id}`,
      song_name: post.song_name,
      song_artist: post.song_artist,
      song_image: post.song_image,
      created_at: post.created_at
    }));

    res.status(200).json({
      status: "success",
      data,
      total: response.data.total,
      page: response.data.page,
      author: "AceGerome"
    });
  } catch (error) {
    console.error("Error fetching data from API:", error.message);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing your request. Please try again later."
    });
  }
};

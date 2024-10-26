const axios = require('axios');

exports.config = {
  name: 'news',
  author: 'AceGerome',
  description: 'Fetches news articles from NewsData API',
  category: 'others',
  link: ['/news']
};

exports.initialize = async function ({ req, res }) {
  try {
    const { country } = req.query;
    const API_KEY = 'pub_50308beff1038e704fb069bda4b56b65548af';
    const BASE_URL = `https://newsdata.io/api/1/news?country=${ "ph" || country }&apikey=${API_KEY}`;
    
    const response = await axios.get(BASE_URL);
    const data = response.data;

    const structuredData = {
      status: data.status,
      totalResults: data.totalResults,
      articles: data.results.map(article => ({
        id: article.article_id,
        title: article.title,
        link: article.link,
        description: article.description,
        pubDate: article.pubDate,
        imageUrl: article.image_url,
        source: {
          name: article.source_name,
          url: article.source_url,
          icon: article.source_icon,
        },
        category: article.category,
        language: article.language,
        country: article.country,
      })),
    };

    res.json(structuredData);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

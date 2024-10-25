const axios = require('axios');

exports.config = {
    name: 'Shoti',
    author: 'Ace Gerome',
    description: 'Generate random Shoti videos',
    category: 'Social',
    link: ['/shoti']
};

exports.initialize = async function ({ req, res, log }) {
    try {
        const { data } = await axios.get(`https://shoti-server-v2.onrender.com/api/v1/request-f`);
        res.json({
          code: data.code,
          status: data.message,
          response: {
            region: data.data.region,
            url: data.data.url,
            title: data.data.title,
            username: data.data.user.username,
            nickname: data.data.user.nickname
          }
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ 
            error: "Failed to fetch data from the API" 
        });
    }
};

/*
{
  "code": 200,
  "message": "success",
  "data": {
    "_shoti_rank": "ERR_METHOD_NOT_REQUIRE_KEY",
    "region": "PH",
    "url": "https://www.tikwm.com/video/media/hdplay/7362942735415840006.mp4",
    "cover": "https://p16-sign-va.tiktokcdn.com/tos-maliva-p-0068/f4f2649190d64cbeb8a35e70290d69d2_1714318701~tplv-tiktokx-cropcenter:300:400.jpeg?dr=14579&nonce=38972&refresh_token=82331b1e72b64e6980d6b18ab28c5179&x-expires=1729947600&x-signature=N8O7EQYIQg3KuOIMJjxEiyRinb8%3D&idc=maliva&ps=13740610&s=AWEME_DETAIL&shcp=34ff8df6&shp=d05b14bd&t=4d5b0474",
    "title": "",
    "duration": "7s",
    "user": {
      "username": "yannaa._1",
      "nickname": "yanaaapogii",
      "userID": "7188688956056683521"
    }
  }
}
*/

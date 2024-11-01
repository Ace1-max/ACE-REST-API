const axios = require("axios");

exports.config = {
  name: 'facebookdl',
  author: 'AceGerome',
  description: 'Fetches video information from a Facebook URL',
  category: 'tools',
  link: ['/fbdl']
};

exports.initialize = async function ({ req, res }) {
  const url = req.query.url;
  if (!url) {
    return res.json({ error: "missing url" });
  }

  const headers = {
    "sec-fetch-user": "?1",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-site": "none",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "cache-control": "max-age=0",
    authority: "www.facebook.com",
    "upgrade-insecure-requests": "1",
    "accept-language": "en-GB,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,en-US;q=0.6",
    "sec-ch-ua":
      '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
    "user-agent":
      req.headers['user-agent'] ||
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    cookie:
      req.headers.cookie ||
      "sb=Rn8BYQvCEb2fpMQZjsd6L382; datr=Rn8BYbyhXgw9RlOvmsosmVNT; c_user=100003164630629; _fbp=fb.1.1629876126997.444699739; wd=1920x939; spin=r.1004812505_b.trunk_t.1638730393_s.1_v.2_; xs=28%3A8ROnP0aeVF8XcQ%3A2%3A1627488145%3A-1%3A4916%3A%3AAcWIuSjPy2mlTPuZAeA2wWzHzEDuumXI89jH8a_QIV8; fr=0jQw7hcrFdas2ZeyT.AWVpRNl_4noCEs_hb8kaZahs-jA.BhrQqa.3E.AAA.0.0.BhrQqa.AWUu879ZtCw",
  };

  const parseString = (string) => JSON.parse(`{"text": "${string}"}`).text;

  const videoUrl = url.trim();

  if (!["facebook.com", "fb.watch"].some((domain) => videoUrl.includes(domain))) {
    return res.json({ error: "Please enter a valid Facebook URL" });
  }

  try {
    const { data } = await axios.get(videoUrl, { headers });
    const sanitizedData = data.replace(/&quot;/g, '"').replace(/&amp;/g, "&");

    const sdMatch = sanitizedData.match(/"browser_native_sd_url":"(.*?)"/) ||
                    sanitizedData.match(/"playable_url":"(.*?)"/) ||
                    sanitizedData.match(/sd_src\s*:\s*"([^"]*)"/) ||
                    sanitizedData.match(/(?<="src":")[^"]*(https:\/\/[^"]*)/);
                    
    const hdMatch = sanitizedData.match(/"browser_native_hd_url":"(.*?)"/) ||
                    sanitizedData.match(/"playable_url_quality_hd":"(.*?)"/) ||
                    sanitizedData.match(/hd_src\s*:\s*"([^"]*)"/);
                    
    const titleMatch = sanitizedData.match(/<meta\sname="description"\scontent="(.*?)"/);
    const thumbMatch = sanitizedData.match(/"preferred_thumbnail":{"image":{"uri":"(.*?)"/);

    if (sdMatch && sdMatch[1]) {
      const result = {
        url: videoUrl,
        sd: parseString(sdMatch[1]),
        hd: hdMatch && hdMatch[1] ? parseString(hdMatch[1]) : "",
        title: titleMatch && titleMatch[1] ? parseString(titleMatch[1]) : sanitizedData.match(/<title>(.*?)<\/title>/)?.[1] ?? "",
        thumbnail: thumbMatch && thumbMatch[1] ? parseString(thumbMatch[1]) : "",
      };

      res.json(result);
    } else {
      res.json({ error: "Unable to fetch video information at this time. Please try again" });
    }
  } catch (error) {
    console.error("Error fetching video information:", error);
    res.json({ error: "Unable to fetch video information at this time. Please try again" });
  }
};

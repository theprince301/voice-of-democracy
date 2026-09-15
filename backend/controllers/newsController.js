const getNews = async (req, res) => {
  try {
    const {
      category = "top",
      country = "in",
      language = "en",
      q = "",
      breaking = "false",
    } = req.query;

    if (!process.env.NEWSDATA_API_KEY) {
      return res.status(500).json({
        message: "NEWSDATA_API_KEY is missing in backend/.env",
      });
    }

    const params = new URLSearchParams();

    params.append("apikey", process.env.NEWSDATA_API_KEY);
    params.append("country", country);
    params.append("language", language);
    params.append("category", category);

    if (q.trim()) {
      params.append("q", q.trim());
    }

    // Breaking news = very recent articles
    if (breaking === "true") {
      params.append("timeframe", "2");
    }

    const response = await fetch(
      `https://newsdata.io/api/1/latest?${params.toString()}`
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("NewsData API error:", data);

      return res.status(response.status).json({
        message: data?.message || "News API request failed",
      });
    }

    const results = (data.results || []).map((article) => ({
      id: article.article_id,
      title: article.title || "Untitled News",
      description: article.description || "",
      image: article.image_url || "",
      url: article.link || "",
      source: article.source_name || "Unknown Source",
      publishedAt: article.pubDate || "",
      category: article.category || [],
      country: article.country || [],
      language: article.language || "",
    }));

    res.json({
      status: "success",
      totalResults: results.length,
      results,
    });
  } catch (error) {
    console.error("News controller error:", error);

    res.status(500).json({
      message: "Unable to fetch news",
    });
  }
};

module.exports = {
  getNews,
};
const getNews = async (req, res) => {
  try {
    const {
      category = "top",
      country = "",
      language = "en",
      q = "",
      timeframe = "",
    } = req.query;

    if (!process.env.NEWSDATA_API_KEY) {
      return res.status(500).json({
        message: "NEWSDATA_API_KEY is missing in backend/.env",
      });
    }

    const params = new URLSearchParams();

    params.append("apikey", process.env.NEWSDATA_API_KEY);
    params.append("language", language);
    params.append("category", category);

    if (country) {
      params.append("country", country);
    }

    if (q.trim()) {
      params.append("q", q.trim());
    }

    if (timeframe) {
      params.append("timeframe", timeframe);
    }

    const response = await fetch(
      `https://newsdata.io/api/1/latest?${params.toString()}`
    );

    const data = await response.json();

    if (!response.ok || data.status === "error") {
      console.error("NewsData API error:", data);

      return res.status(response.status || 500).json({
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
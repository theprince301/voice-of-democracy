import { useEffect, useState } from "react";
import api from "../api/axios";

const NEWS_TABS = [
  {
    id: "india",
    label: "🇮🇳 India",
    category: "top",
    country: "in",
  },
  {
    id: "politics",
    label: "🏛️ Politics",
    category: "politics",
    country: "in",
  },
  {
    id: "world",
    label: "🌎 World",
    category: "world",
    country: "in",
  },
  {
    id: "business",
    label: "💰 Business",
    category: "business",
    country: "in",
  },
  {
    id: "technology",
    label: "💻 Technology",
    category: "technology",
    country: "in",
  },
  {
    id: "sports",
    label: "🏏 Sports",
    category: "sports",
    country: "in",
  },
  {
    id: "entertainment",
    label: "🎬 Entertainment",
    category: "entertainment",
    country: "in",
  },
  {
    id: "breaking",
    label: "🔥 Breaking News",
    category: "top",
    country: "in",
    breaking: true,
  },
  {
    id: "latest",
    label: "📅 Latest News",
    category: "top",
    country: "in",
  },
];

export default function LatestNews() {
  const [activeTab, setActiveTab] = useState("india");

  const [news, setNews] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [searched, setSearched] = useState(false);

  const loadNews = async (tabId = activeTab, searchText = "") => {
    try {
      setLoading(true);
      setError("");

      const selectedTab =
        NEWS_TABS.find((tab) => tab.id === tabId) || NEWS_TABS[0];

      const params = {
        category: selectedTab.category,
        country: selectedTab.country,
        language: "en",
      };

      if (selectedTab.breaking) {
        params.breaking = "true";
      }

      if (searchText.trim()) {
        params.q = searchText.trim();
      }

      const response = await api.get("/news", {
        params,
      });

      setNews(response.data.results || []);
    } catch (err) {
      console.error("News loading error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load latest news."
      );

      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews("india");
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearched(false);
    setSearch("");

    loadNews(tabId);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      setSearched(false);
      loadNews(activeTab);
      return;
    }

    setSearched(true);
    loadNews(activeTab, search);
  };

  return (
    <section className="latest-news-section">

      {/* Header */}
      <div className="latest-news-header">

        <div>
          <h2>Latest News</h2>

          <p>
            {searched
              ? `Search results for "${search}"`
              : "Latest news from around the world"}
          </p>
        </div>

      </div>

      {/* News Tabs */}
      <div className="news-tabs">

        {NEWS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`news-tab ${
              activeTab === tab.id
                ? "news-tab-active"
                : ""
            }`}
          >
            {tab.label}
          </button>
        ))}

      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="news-search-form"
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔎 Search news..."
          className="news-search-input"
        />

        <button
          type="submit"
          className="news-search-button"
        >
          Search
        </button>
      </form>

      {/* Loading */}
      {loading && (
        <div className="news-status">
          Loading latest news...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="news-error">
          {error}
        </div>
      )}

      {/* No results */}
      {!loading && !error && news.length === 0 && (
        <div className="news-status">
          No news found.
        </div>
      )}

      {/* News Cards */}
      {!loading && !error && news.length > 0 && (
        <div className="news-grid">

          {news.map((item) => (
            <article
              className="news-card"
              key={item.id}
            >

              {/* Image */}
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="news-card-image"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="news-card-no-image">
                  📰
                </div>
              )}

              <div className="news-card-body">

                {/* Source */}
                <span className="news-source">
                  {item.source}
                </span>

                {/* Title */}
                <h3>{item.title}</h3>

                {/* Description */}
                {item.description && (
                  <p>
                    {item.description.length > 150
                      ? `${item.description.substring(
                          0,
                          150
                        )}...`
                      : item.description}
                  </p>
                )}

                {/* Footer */}
                <div className="news-card-footer">

                  <span>
                    {item.publishedAt
                      ? new Date(
                          item.publishedAt
                        ).toLocaleDateString()
                      : ""}
                  </span>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read News →
                    </a>
                  )}

                </div>

              </div>
            </article>
          ))}

        </div>
      )}

    </section>
  );
}
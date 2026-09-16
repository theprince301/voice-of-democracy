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
    country: "",
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
    timeframe: "2",
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

  const loadNews = async (tabId = activeTab, searchText = "") => {
    try {
      setLoading(true);
      setError("");

      const selectedTab =
        NEWS_TABS.find((tab) => tab.id === tabId) || NEWS_TABS[0];

      const params = {
        category: selectedTab.category,
        language: "en",
      };

      if (selectedTab.country) {
        params.country = selectedTab.country;
      }

      if (selectedTab.timeframe) {
        params.timeframe = selectedTab.timeframe;
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
    setSearch("");
    loadNews(tabId);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      loadNews(activeTab);
      return;
    }

    loadNews(activeTab, search);
  };

  return (
    <section className="latest-news-section">

      <div className="latest-news-header">
        <div>
          <h2>Latest News</h2>
          <p>News from India and around the world</p>
        </div>
      </div>

      {/* NEWS CATEGORIES */}
      <div className="news-tabs">
        {NEWS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
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

      {/* SEARCH */}
      <form
        onSubmit={handleSearch}
        className="news-search-form"
      >
        <input
          type="text"
          placeholder="🔎 Search news..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="news-search-input"
        />

        <button
          type="submit"
          className="news-search-button"
        >
          Search
        </button>
      </form>

      {/* LOADING */}
      {loading && (
        <div className="news-status">
          Loading latest news...
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="news-error">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && news.length === 0 && (
        <div className="news-status">
          No news found.
        </div>
      )}

      {/* NEWS */}
      {!loading && !error && news.length > 0 && (
        <div className="news-grid">
          {news.map((item) => (
            <article
              className="news-card"
              key={item.id}
            >

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

                <span className="news-source">
                  {item.source}
                </span>

                <h3>{item.title}</h3>

                {item.description && (
                  <p>
                    {item.description.length > 160
                      ? `${item.description.substring(
                          0,
                          160
                        )}...`
                      : item.description}
                  </p>
                )}

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
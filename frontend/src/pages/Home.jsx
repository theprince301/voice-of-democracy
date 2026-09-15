import { useEffect, useState } from "react";
import api from "../api/axios";
import ArticleCard from "../components/ArticleCard";
import LatestNews from "../components/LatestNews.jsx";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.category = activeCategory;
    if (search) params.search = search;

    api
      .get("/articles", { params })
      .then((res) => setArticles(res.data.articles))
      .finally(() => setLoading(false));
  }, [activeCategory, search]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory("")}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              !activeCategory ? "bg-primary text-white border-primary" : "border-gray-300"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat._id)}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                activeCategory === cat._id
                  ? "bg-primary text-white border-primary"
                  : "border-gray-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
          <LatestNews />
        </div>

        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-64"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading articles...</p>
      ) : articles.length === 0 ? (
        <p className="text-gray-500">No articles found.</p>
      ) : (
        <div>
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

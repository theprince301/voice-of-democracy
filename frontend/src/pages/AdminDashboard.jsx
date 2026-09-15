import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadArticles = () => {
    setLoading(true);
    api
      .get("/articles/admin")
      .then((res) => setArticles(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    await api.delete(`/articles/${id}`);
    setArticles(articles.filter((a) => a._id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold">Newsroom Dashboard</h1>
        <Link
          to="/admin/new"
          className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary-dark"
        >
          + New Article
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-300 text-gray-500">
              <th className="py-2">Title</th>
              <th className="py-2">Author</th>
              <th className="py-2">Status</th>
              <th className="py-2">Views</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a._id} className="border-b border-gray-100">
                <td className="py-3 font-medium">{a.title}</td>
                <td className="py-3 text-gray-500">{a.author?.name}</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      a.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="py-3 text-gray-500">{a.views}</td>
                <td className="py-3 text-right space-x-3">
                  <Link to={`/admin/edit/${a._id}`} className="text-primary hover:underline">
                    Edit
                  </Link>
                  {(user.role === "admin" || user._id === a.author?._id) && (
                    <button
                      onClick={() => handleDelete(a._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

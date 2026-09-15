import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function ArticleForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "",
    tags: "",
    status: "draft",
    isBreaking: false,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
    if (isEdit) {
      api.get("/articles/admin").then((res) => {
        const article = res.data.find((a) => a._id === id);
        if (article) {
          setForm({
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            coverImage: article.coverImage || "",
            category: article.category?._id || "",
            tags: (article.tags || []).join(", "),
            status: article.status,
            isBreaking: article.isBreaking,
          });
        }
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (isEdit) {
        await api.put(`/articles/${id}`, payload);
      } else {
        await api.post("/articles", payload);
      }
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save article");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-serif text-2xl font-bold mb-6">
        {isEdit ? "Edit Article" : "New Article"}
      </h1>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Headline"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          placeholder="Short excerpt (max 300 chars)"
          maxLength={300}
          required
          rows={2}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Full article content"
          required
          rows={10}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <input
          name="coverImage"
          value={form.coverImage}
          onChange={handleChange}
          placeholder="Cover image URL"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />

        <div className="flex gap-3">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isBreaking"
            checked={form.isBreaking}
            onChange={handleChange}
          />
          Mark as breaking news
        </label>

        <button
          type="submit"
          className="bg-primary text-white px-5 py-2 rounded text-sm font-medium hover:bg-primary-dark"
        >
          {isEdit ? "Save Changes" : "Publish / Save Draft"}
        </button>
      </form>
    </div>
  );
}

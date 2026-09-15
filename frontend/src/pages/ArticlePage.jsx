import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ArticlePage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/articles/${slug}`)
      .then((res) => {
        setArticle(res.data);
        return api.get(`/comments/${res.data._id}`);
      })
      .then((res) => setComments(res.data))
      .finally(() => setLoading(false));
  }, [slug]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const { data } = await api.post("/comments", {
      articleId: article._id,
      text: commentText,
    });
    setComments([data, ...comments]);
    setCommentText("");
  };

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 text-gray-500">Loading...</div>;
  if (!article) return <div className="max-w-3xl mx-auto px-4 py-16">Article not found.</div>;

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {article.isBreaking && (
        <span className="inline-block bg-primary text-white text-xs font-bold px-2 py-0.5 rounded mb-2">
          BREAKING
        </span>
      )}
      <p className="text-sm text-primary font-semibold uppercase tracking-wide mb-2">
        {article.category?.name}
      </p>
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink leading-tight mb-3">
        {article.title}
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        By {article.author?.name} ·{" "}
        {article.publishedAt && new Date(article.publishedAt).toLocaleDateString()} ·{" "}
        {article.views} views
      </p>

      {article.coverImage && (
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-auto rounded mb-6"
        />
      )}

      <div className="prose max-w-none whitespace-pre-wrap leading-relaxed text-ink">
        {article.content}
      </div>

      {article.tags?.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-6">
          {article.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <section className="mt-12 border-t border-gray-200 pt-6">
        <h2 className="font-serif text-xl font-bold mb-4">Comments ({comments.length})</h2>

        {user ? (
          <form onSubmit={submitComment} className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full border border-gray-300 rounded p-3 text-sm"
              rows={3}
            />
            <button
              type="submit"
              className="mt-2 bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary-dark"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-500 mb-6">Log in to join the discussion.</p>
        )}

        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c._id} className="border-b border-gray-100 pb-3">
              <p className="text-sm font-semibold">{c.user?.name}</p>
              <p className="text-sm text-gray-700">{c.text}</p>
              <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  return (
    <Link
      to={`/article/${article.slug}`}
      className="block border-b border-gray-200 pb-6 mb-6 group"
    >
      <div className="flex gap-4">
        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-32 h-24 md:w-48 md:h-32 object-cover rounded flex-shrink-0"
          />
        )}
        <div>
          {article.isBreaking && (
            <span className="inline-block bg-primary text-white text-xs font-bold px-2 py-0.5 rounded mb-1">
              BREAKING
            </span>
          )}
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {article.category?.name}
          </p>
          <h2 className="font-serif text-xl md:text-2xl font-bold text-ink group-hover:text-primary transition leading-snug">
            {article.title}
          </h2>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{article.excerpt}</p>
          <p className="text-xs text-gray-400 mt-2">
            {article.author?.name} ·{" "}
            {article.publishedAt && new Date(article.publishedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}

const Article = require("../models/Article");

// @route GET /api/articles  (public - published only, supports ?category= &search= &tag=)
const getArticles = async (req, res) => {
  try {
    const { category, search, tag, page = 1, limit = 10 } = req.query;
    const query = { status: "published" };

    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) query.$text = { $search: search };

    const articles = await Article.find(query)
      .populate("author", "name avatar")
      .populate("category", "name slug")
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Article.countDocuments(query);

    res.json({ articles, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/articles/admin  (admin/editor - all statuses)
const getAllArticlesForStaff = async (req, res) => {
  try {
    const articles = await Article.find({})
      .populate("author", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/articles/:slug (public - increments views)
const getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("author", "name avatar bio")
      .populate("category", "name slug");

    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/articles (admin/editor)
const createArticle = async (req, res) => {
  try {
    const { title, excerpt, content, coverImage, category, tags, status, isBreaking } = req.body;

    const article = await Article.create({
      title,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      status,
      isBreaking,
      author: req.user._id,
    });

    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/articles/:id (admin, or editor who owns the article)
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    const isOwner = article.author.toString() === req.user._id.toString();
    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ message: "You can only edit your own articles" });
    }

    Object.assign(article, req.body);
    await article.save();
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/articles/:id (admin, or editor who owns the article)
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    const isOwner = article.author.toString() === req.user._id.toString();
    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ message: "You can only delete your own articles" });
    }

    await article.deleteOne();
    res.json({ message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getArticles,
  getAllArticlesForStaff,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
};

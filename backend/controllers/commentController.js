const Comment = require("../models/Comment");

// @route GET /api/comments/:articleId
const getCommentsForArticle = async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/comments (any logged-in user)
const addComment = async (req, res) => {
  try {
    const { articleId, text } = req.body;
    const comment = await Comment.create({
      article: articleId,
      user: req.user._id,
      text,
    });
    const populated = await comment.populate("user", "name avatar");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/comments/:id (owner or admin)
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isOwner = comment.user.toString() === req.user._id.toString();
    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCommentsForArticle, addComment, deleteComment };

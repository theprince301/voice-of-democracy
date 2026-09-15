const express = require("express");
const router = express.Router();
const { getCommentsForArticle, addComment, deleteComment } = require("../controllers/commentController");
const { protect } = require("../middleware/auth");

router.get("/:articleId", getCommentsForArticle);
router.post("/", protect, addComment);
router.delete("/:id", protect, deleteComment);

module.exports = router;

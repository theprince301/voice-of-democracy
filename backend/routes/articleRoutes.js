const express = require("express");
const router = express.Router();
const {
  getArticles,
  getAllArticlesForStaff,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", getArticles);
router.get("/admin", protect, authorize("admin", "editor"), getAllArticlesForStaff);
router.get("/:slug", getArticleBySlug);
router.post("/", protect, authorize("admin", "editor"), createArticle);
router.put("/:id", protect, authorize("admin", "editor"), updateArticle);
router.delete("/:id", protect, authorize("admin", "editor"), deleteArticle);

module.exports = router;

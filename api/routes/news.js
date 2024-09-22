import { Router } from "express";
import { decodeUserFromToken, checkAuth } from "../middleware/auth.js";
import * as newsCtrl from "../controllers/news.js";

const router = Router();

// Public route to get news
router.get("/", newsCtrl.getNews);

// Protected routes
router.use(decodeUserFromToken);
router.post("/", checkAuth, newsCtrl.createNews);
router.put("/:id", checkAuth, newsCtrl.updateNews);
router.delete("/:id", checkAuth, newsCtrl.deleteNews);

export { router as newsRouter };

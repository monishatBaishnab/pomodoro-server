import { Router } from "express";
import auth from "../../middlewares/auth";
import { badge_controllers } from "./badge.controllers";
import { multer_up } from "../../middlewares/upload";
import parse_json from "../../middlewares/parse_json";

// Create a new express router instance
const router = Router();

// Route for fetch all badges
router.get("/", auth, badge_controllers.fetch_all);

router.get("/user", auth, badge_controllers.fetch_user_badges);


// Route for create badge
router.post("/", auth, multer_up.single('file'), parse_json, badge_controllers.create_one);

router.post("/user", auth, badge_controllers.create_user_badges);

// Export router instance named "badge"
export const badge_routes = router;

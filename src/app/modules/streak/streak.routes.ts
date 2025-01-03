import { Router } from "express";
import { streak_controllers } from "./streak.controllers";
import auth from "../../middlewares/auth";

// Create a new express router instance
const router = Router();

// Route for fetch all streaks
router.get("/", auth, streak_controllers.fetch_all);

// Route for create streak
router.post("/", auth, streak_controllers.create_one);

// Export router instance named "streak"
export const streak_routes = router;

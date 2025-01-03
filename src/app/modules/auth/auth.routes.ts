import { Router } from "express";
import { auth_controllers } from "./auth.controllers";
import { multer_up } from "../../middlewares/upload";
import parse_json from "../../middlewares/parse_json";

// Create a new express router instance
const router = Router();

// Login route
router.post("/login", auth_controllers.login);

// Register route
router.post("/register", multer_up.single("file"), parse_json, auth_controllers.register);

// Export router instance named "user_routes"
export const auth_routes = router;

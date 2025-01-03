import { Router } from "express";
import { focus_session_controllers } from "./focus.controllers";
import auth from "../../middlewares/auth";

// Create a new express router instance
const session_router = Router();

// Route for create focus session
session_router.post("/", auth, focus_session_controllers.create_one);

// Export router instance named "user_routes"
export const focus_session_routes = session_router;

// Create a new express router instance
const metric_router = Router();

// Route for create focus session
metric_router.get("/", auth, focus_session_controllers.fetch_metric);

// Export router instance named "user_routes"
export const focus_metric_routes = metric_router;

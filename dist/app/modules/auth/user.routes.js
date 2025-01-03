"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_routes = void 0;
const express_1 = require("express");
const auth_controllers_1 = require("./auth.controllers");
// Create a new express router instance
const router = (0, express_1.Router)();
// Login route
router.post("/login", auth_controllers_1.user_controllers.login);
// Register route
router.post("/register", auth_controllers_1.user_controllers.register);
// Export router instance named "user_routes"
exports.user_routes = router;
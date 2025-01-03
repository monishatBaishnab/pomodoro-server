"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.focus_metric_routes = exports.focus_session_routes = void 0;
const express_1 = require("express");
const focus_controllers_1 = require("./focus.controllers");
// Create a new express router instance
const session_router = (0, express_1.Router)();
// Route for create focus session
session_router.post("/", focus_controllers_1.focus_session_controllers.create_one);
// Export router instance named "user_routes"
exports.focus_session_routes = session_router;
// Create a new express router instance
const metric_router = (0, express_1.Router)();
// Route for create focus session
metric_router.post("/", focus_controllers_1.focus_session_controllers.create_one);
// Export router instance named "user_routes"
exports.focus_metric_routes = metric_router;

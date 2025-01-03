"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.focus_metric_routes = exports.focus_session_routes = void 0;
const express_1 = require("express");
const focus_controllers_1 = require("./focus.controllers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
// Create a new express router instance
const session_router = (0, express_1.Router)();
// Route for create focus session
session_router.post("/", auth_1.default, focus_controllers_1.focus_session_controllers.create_one);
// Export router instance named "user_routes"
exports.focus_session_routes = session_router;
// Create a new express router instance
const metric_router = (0, express_1.Router)();
// Route for create focus session
metric_router.get("/", auth_1.default, focus_controllers_1.focus_session_controllers.fetch_metric);
// Export router instance named "user_routes"
exports.focus_metric_routes = metric_router;

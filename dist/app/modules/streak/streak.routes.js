"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streak_routes = void 0;
const express_1 = require("express");
const streak_controllers_1 = require("./streak.controllers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
// Create a new express router instance
const router = (0, express_1.Router)();
// Route for create streak
router.post("/", auth_1.default, streak_controllers_1.streak_controllers.create_one);
// Export router instance named "streak"
exports.streak_routes = router;

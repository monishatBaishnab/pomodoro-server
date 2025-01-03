"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth_routes = void 0;
const express_1 = require("express");
const auth_controllers_1 = require("./auth.controllers");
const upload_1 = require("../../middlewares/upload");
const parse_json_1 = __importDefault(require("../../middlewares/parse_json"));
// Create a new express router instance
const router = (0, express_1.Router)();
// Login route
router.post("/login", auth_controllers_1.auth_controllers.login);
// Register route
router.post("/register", upload_1.multer_up.single("file"), parse_json_1.default, auth_controllers_1.auth_controllers.register);
// Export router instance named "user_routes"
exports.auth_routes = router;

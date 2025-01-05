"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.badge_routes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const badge_controllers_1 = require("./badge.controllers");
const upload_1 = require("../../middlewares/upload");
const parse_json_1 = __importDefault(require("../../middlewares/parse_json"));
// Create a new express router instance
const router = (0, express_1.Router)();
// Route for fetch all badges
router.get("/", auth_1.default, badge_controllers_1.badge_controllers.fetch_all);
router.get("/user", auth_1.default, badge_controllers_1.badge_controllers.fetch_user_badges);
// Route for create badge
router.post("/", auth_1.default, upload_1.multer_up.single('file'), parse_json_1.default, badge_controllers_1.badge_controllers.create_one);
router.post("/user", auth_1.default, badge_controllers_1.badge_controllers.create_user_badges);
// Export router instance named "badge"
exports.badge_routes = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app_routes = void 0;
const express_1 = require("express");
const routes = [];
const router = (0, express_1.Router)();
routes.forEach((route) => router.use(route.path, route.element));
exports.app_routes = router;

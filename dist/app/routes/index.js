"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app_routes = void 0;
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const focus_routes_1 = require("../modules/focus_session/focus.routes");
const streak_routes_1 = require("../modules/streak/streak.routes");
const routes = [
    {
        path: "/auth",
        element: auth_routes_1.auth_routes,
    },
    {
        path: "/focus-session",
        element: focus_routes_1.focus_session_routes,
    },
    {
        path: "/focus-metrics",
        element: focus_routes_1.focus_metric_routes,
    },
    {
        path: "/streaks",
        element: streak_routes_1.streak_routes,
    },
];
const router = (0, express_1.Router)();
routes.forEach((route) => router.use(route.path, route.element));
exports.app_routes = router;

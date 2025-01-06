"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streak_services = void 0;
const prisma_client_1 = __importDefault(require("../../utils/prisma_client"));
const redisClient_1 = __importDefault(require("../../redis/redisClient"));
const focus_services_1 = require("../focus_session/focus.services");
const STREAKS_CACHE_KEY = (user_id) => `streaks:${user_id}:data`;
// Service for fetching all streaks
const fetch_all_from_db = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient_1.default.del(STREAKS_CACHE_KEY(user.id));
    const cached_streaks = yield redisClient_1.default.get(STREAKS_CACHE_KEY(user.id));
    const metrics = yield focus_services_1.focus_session_services.fetch_metric_from_db(user);
    let streaks = cached_streaks ? JSON.parse(cached_streaks) : null;
    if (!streaks) {
        streaks = yield prisma_client_1.default.streak.findMany({
            where: {
                userId: user.id,
            },
        });
        // redisClient.set(STREAKS_CACHE_KEY(user.id), JSON.stringify(streaks), { EX: 3600 });
    }
    return Object.assign({ streaks }, metrics);
});
// Service for create new
const create_one_into_db = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // Helper function to calculate one day in milliseconds
    const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
    const cached_streaks = yield redisClient_1.default.get(STREAKS_CACHE_KEY(user.id));
    let streak = cached_streaks ? JSON.parse(cached_streaks) : null;
    if (!streak) {
        streak = yield prisma_client_1.default.streak.findFirst({
            where: { userId: user.id },
        });
    }
    // Get current date and last active date (normalized to remove time part)
    const today = new Date(new Date().toDateString()).getTime();
    const lastActive = (streak === null || streak === void 0 ? void 0 : streak.lastActive)
        ? new Date(new Date(streak.lastActive).toDateString()).getTime()
        : 0;
    // Default values for current streak and longest streak
    let currentStreak = streak ? Number(streak.currentStreak) : 1;
    let longestStreak = streak ? Number(streak.longestStreak) : 1;
    // If streak exists, check if the user has maintained the streak
    if (streak) {
        if (lastActive + ONE_DAY_IN_MS == today) {
            currentStreak = Number(streak.currentStreak) + 1;
            longestStreak = Math.max(longestStreak, currentStreak);
        }
        yield redisClient_1.default.del(STREAKS_CACHE_KEY(user.id));
        // Update streak data
        yield prisma_client_1.default.streak.update({
            data: {
                currentStreak,
                longestStreak,
                lastActive: new Date(),
                userId: user.id,
            },
            where: { id: streak.id },
        });
    }
    // If no streak exists, create a new one
    if (!streak) {
        yield prisma_client_1.default.streak.create({
            data: {
                currentStreak: 1,
                longestStreak: 1,
                lastActive: new Date(),
                userId: user.id,
            },
        });
    }
    streak = yield prisma_client_1.default.streak.findFirst({
        where: { userId: user.id },
    });
    redisClient_1.default.set(STREAKS_CACHE_KEY(user.id), JSON.stringify(streak), { EX: 3600 });
    return streak;
});
exports.streak_services = {
    fetch_all_from_db,
    create_one_into_db,
};

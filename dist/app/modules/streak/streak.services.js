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
// Service for create new
// Helper function to calculate one day in milliseconds
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const create_one_into_db = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch streak data for the user
    const streak = yield prisma_client_1.default.streak.findFirst({
        where: { userId: user.id },
    });
    // Get current date and last active date (normalized to remove time part)
    const today = new Date(new Date().toDateString()).getTime();
    const lastActive = (streak === null || streak === void 0 ? void 0 : streak.lastActive) ? new Date(streak.lastActive.toDateString()).getTime() : 0;
    // Default values for current streak and longest streak
    let currentStreak = 1;
    let longestStreak = streak ? Number(streak.longestStreak) : 1;
    // If streak exists, check if the user has maintained the streak
    if (streak) {
        if (lastActive + ONE_DAY_IN_MS == today) {
            currentStreak = Number(streak.currentStreak) + 1;
            longestStreak = Math.max(longestStreak, currentStreak);
        }
        // Update streak data
        const updatedStreak = yield prisma_client_1.default.streak.update({
            data: {
                currentStreak,
                longestStreak,
                lastActive: new Date(),
                userId: user.id,
            },
            where: { id: streak.id },
        });
        return updatedStreak;
    }
    // If no streak exists, create a new one
    const newStreak = yield prisma_client_1.default.streak.create({
        data: {
            currentStreak: 1,
            longestStreak: 1,
            lastActive: new Date(),
            userId: user.id,
        },
    });
    return newStreak;
});
exports.streak_services = {
    create_one_into_db,
};

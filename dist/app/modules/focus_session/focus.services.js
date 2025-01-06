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
exports.focus_session_services = exports.FOCUS_SESSION_CACHE_KEY = void 0;
const prisma_client_1 = __importDefault(require("../../utils/prisma_client"));
const redisClient_1 = __importDefault(require("../../redis/redisClient"));
const FOCUS_SESSION_CACHE_KEY = (user_id) => `focus_session:${user_id}:data`;
exports.FOCUS_SESSION_CACHE_KEY = FOCUS_SESSION_CACHE_KEY;
// Service for create new focus session
const fetch_metric_from_db = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const cached_focus_metric = yield redisClient_1.default.get((0, exports.FOCUS_SESSION_CACHE_KEY)(user.id));
    let sessions = cached_focus_metric ? JSON.parse(cached_focus_metric) : null;
    if (!sessions) {
        sessions = yield prisma_client_1.default.focusSession.findMany({
            where: { userId: user.id },
            orderBy: { timestamps: "asc" },
        });
        yield redisClient_1.default.set((0, exports.FOCUS_SESSION_CACHE_KEY)(user.id), JSON.stringify(sessions), { EX: 3600 });
    }
    const total_duration = sessions === null || sessions === void 0 ? void 0 : sessions.reduce((sum, session) => {
        return (sum += Number(session.duration));
    }, 0);
    return { sessions, total_duration, total_sessions: sessions === null || sessions === void 0 ? void 0 : sessions.length };
});
// Service for create new focus session
const create_one_into_db = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { duration, userId } = payload !== null && payload !== void 0 ? payload : {};
    yield prisma_client_1.default.user.findUniqueOrThrow({
        where: { id: userId },
    });
    const created_session = yield prisma_client_1.default.focusSession.create({
        data: { duration: Number(duration), userId },
    });
    yield redisClient_1.default.del((0, exports.FOCUS_SESSION_CACHE_KEY)(payload.userId));
    const sessions = yield prisma_client_1.default.focusSession.findMany({
        where: { userId: payload.userId },
        orderBy: { timestamps: "desc" },
    });
    yield redisClient_1.default.set((0, exports.FOCUS_SESSION_CACHE_KEY)(payload.userId), JSON.stringify(sessions), { EX: 3600 });
    return created_session;
});
exports.focus_session_services = {
    fetch_metric_from_db,
    create_one_into_db,
};

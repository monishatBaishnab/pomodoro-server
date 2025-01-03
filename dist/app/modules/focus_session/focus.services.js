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
exports.focus_session_services = void 0;
const prisma_client_1 = __importDefault(require("../../utils/prisma_client"));
// Service for create new focus session
const fetch_metric_from_db = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const sessions = yield prisma_client_1.default.focusSession.findMany({
        where: { userId: user.id },
        orderBy: { timestamps: "desc" },
    });
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
    return created_session;
});
exports.focus_session_services = {
    fetch_metric_from_db,
    create_one_into_db,
};

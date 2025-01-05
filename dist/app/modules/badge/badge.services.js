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
exports.badge_services = void 0;
const upload_1 = require("../../middlewares/upload");
const prisma_client_1 = __importDefault(require("../../utils/prisma_client"));
const redisClient_1 = __importDefault(require("../../redis/redisClient"));
const USER_BADGES_CACHE_KEY = (user_id) => `badges:${user_id}:data`;
// Service for fetching all badges
const fetch_all_from_db = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const badges = yield prisma_client_1.default.badge.findMany({
        orderBy: { createdAt: "asc" },
    });
    return badges;
});
// Service for fetching all badges
const fetch_user_badge_from_db = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient_1.default.del(USER_BADGES_CACHE_KEY(user.id));
    const cached_badges = yield redisClient_1.default.get(USER_BADGES_CACHE_KEY(user.id));
    let badges = cached_badges ? JSON.parse(cached_badges) : null;
    if (!(badges === null || badges === void 0 ? void 0 : badges.length)) {
        badges = yield prisma_client_1.default.userBadge.findMany({
            where: { userId: user.id },
            select: {
                id: true,
                badge: {
                    select: { id: true, name: true, description: true, icon: true },
                },
            },
        });
        yield redisClient_1.default.set(USER_BADGES_CACHE_KEY(user.id), JSON.stringify(badges), { EX: 3600 });
    }
    return badges;
});
// Service for create new
const create_one_into_db = (payload, user, file) => __awaiter(void 0, void 0, void 0, function* () {
    const badge_data = Object.assign({}, payload);
    // Upload image in cloudinary and set the image link in user data
    const uploaded_image_info = yield (0, upload_1.cloudinary_uploader)(file);
    if (uploaded_image_info === null || uploaded_image_info === void 0 ? void 0 : uploaded_image_info.secure_url) {
        badge_data.icon = uploaded_image_info.secure_url;
    }
    // For non-vendor users, simply create the user record
    const created_badge = yield prisma_client_1.default.badge.create({
        data: badge_data,
    });
    return created_badge;
});
const create_user_badge = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const created_badge = yield prisma_client_1.default.userBadge.create({
        data: { badgeId: payload.badgeId, userId: payload.userId },
    });
    return created_badge;
});
exports.badge_services = {
    fetch_all_from_db,
    fetch_user_badge_from_db,
    create_one_into_db,
    create_user_badge,
};

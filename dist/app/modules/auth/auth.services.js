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
exports.auth_services = void 0;
const prisma_client_1 = __importDefault(require("../../utils/prisma_client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = require("../../config");
const http_error_1 = __importDefault(require("../../errors/http_error"));
const jwt_1 = require("../../utils/jwt");
const upload_1 = require("../../middlewares/upload");
const redisClient_1 = __importDefault(require("../../redis/redisClient"));
const USER_CACHE_KEY = (userId) => `user:${userId}:data`;
// Service for login user
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // await redisClient.del(USER_CACHE_KEY(payload.email));
    const cachedUser = yield redisClient_1.default.get(USER_CACHE_KEY(payload.email));
    // Parse json data from cached string
    let user_info = cachedUser ? JSON.parse(cachedUser) : null;
    if (!cachedUser || cachedUser == null) {
        user_info = yield prisma_client_1.default.user.findUniqueOrThrow({
            where: { email: payload.email, isDeleted: false },
        });
        yield redisClient_1.default.set(USER_CACHE_KEY(payload.email), JSON.stringify(user_info), { EX: 3600 });
    }
    const is_match_pass = yield bcrypt_1.default.compare(String(payload.password), user_info.password);
    if (!is_match_pass) {
        throw new http_error_1.default(http_status_1.default.UNAUTHORIZED, "Password not matched.");
    }
    const token_data = (0, jwt_1.sanitize_token_data)(user_info);
    const token = (0, jwt_1.generate_token)(token_data, config_1.local_config.jwt_secret);
    return { token };
});
// Service for register new user and insert user data in db
const register = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    const user_data = Object.assign({}, payload);
    // Hashed password and set this in user data
    const hashed_password = yield bcrypt_1.default.hash(String(payload.password), Number(config_1.local_config.bcrypt_salt));
    user_data.password = hashed_password;
    // Upload image in cloudinary and set the image link in user data
    const uploaded_image_info = yield (0, upload_1.cloudinary_uploader)(file);
    if (uploaded_image_info === null || uploaded_image_info === void 0 ? void 0 : uploaded_image_info.secure_url) {
        user_data.profile_picture = uploaded_image_info.secure_url;
    }
    // For non-vendor users, simply create the user record
    const created_user = yield prisma_client_1.default.user.create({
        data: user_data,
    });
    yield redisClient_1.default.set(USER_CACHE_KEY(payload.id), JSON.stringify(created_user));
    const token_data = (0, jwt_1.sanitize_token_data)(created_user);
    const token = (0, jwt_1.generate_token)(token_data, config_1.local_config.jwt_secret);
    return { token };
});
exports.auth_services = {
    login,
    register,
};

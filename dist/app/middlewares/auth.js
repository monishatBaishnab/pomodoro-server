"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catch_async_1 = __importDefault(require("../utils/catch_async"));
const http_error_1 = __importDefault(require("../errors/http_error"));
const config_1 = require("../config");
const http_status_1 = __importDefault(require("http-status"));
const jwt_1 = require("../utils/jwt");
const auth = (0, catch_async_1.default)((req, res, next) => {
    var _a;
    const token = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    if (!token) {
        throw new http_error_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized.");
    }
    const verified_user = (0, jwt_1.verify_token)(token, config_1.local_config.jwt_secret);
    req.user = verified_user;
    next();
});
exports.default = auth;

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
exports.auth_controllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../utils/catch_async"));
const send_response_1 = __importDefault(require("../../utils/send_response"));
const auth_services_1 = require("./auth.services");
// Controller for login
const login = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Logging user
    const result = yield auth_services_1.auth_services.login(req.body);
    // Send response to client
    (0, send_response_1.default)(res, {
        message: "Login Successful.",
        status: http_status_1.default.OK,
        data: result,
    });
}));
// Controller for register user
const register = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Creating user
    const result = yield auth_services_1.auth_services.register(req.body, req.file);
    // Send response to client
    (0, send_response_1.default)(res, {
        message: "User created.",
        status: http_status_1.default.CREATED,
        data: result,
    });
}));
exports.auth_controllers = {
    login,
    register,
};

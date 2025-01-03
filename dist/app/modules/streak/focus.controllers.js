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
exports.focus_session_controllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../utils/catch_async"));
const send_response_1 = __importDefault(require("../../utils/send_response"));
const focus_services_1 = require("./focus.services");
// Controller for create focus session
const fetch_metric = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Creating focus session
    const result = yield focus_services_1.focus_session_services.fetch_metric_from_db(req.user);
    // Send response to client
    (0, send_response_1.default)(res, {
        message: "Focus Metrics Fetched.",
        status: http_status_1.default.OK,
        data: result,
    });
}));
// Controller for create focus session
const create_one = (0, catch_async_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Creating focus session
    const result = yield focus_services_1.focus_session_services.create_one_into_db(req.body);
    // Send response to client
    (0, send_response_1.default)(res, {
        message: "Focus Session Created.",
        status: http_status_1.default.CREATED,
        data: result,
    });
}));
exports.focus_session_controllers = {
    fetch_metric,
    create_one,
};

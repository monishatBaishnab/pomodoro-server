"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// redisClient.ts
const redis_1 = require("redis");
const config_1 = require("../config");
// Use environment variables for Redis URL (Vercel stores environment variables securely)
const redisClient = (0, redis_1.createClient)({
    url: config_1.local_config.redis_url || "redis://127.0.0.1:6379", // Default to localhost for local development
});
redisClient.connect();
// Log a success message when Redis is connected
redisClient.on("connect", () => {
    console.log("Successfully connected to Redis");
});
// Handle connection errors
redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
});
exports.default = redisClient;

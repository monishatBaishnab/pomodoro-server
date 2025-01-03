// redisClient.ts
import { createClient } from "redis";
import { local_config } from "../config";

// Use environment variables for Redis URL (Vercel stores environment variables securely)
const redisClient = createClient({
  url: local_config.redis_url || "redis://127.0.0.1:6379", // Default to localhost for local development
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

export default redisClient;

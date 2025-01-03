import { JwtPayload } from "jsonwebtoken";
import prisma from "../../utils/prisma_client";
import redisClient from "../../redis/redisClient";

const STREAKS_CACHE_KEY = (user_id: string) => `streaks:${user_id}:data`;

// Service for fetching all streaks
const fetch_all_from_db = async (user: JwtPayload) => {
  const cached_streaks = await redisClient.get(STREAKS_CACHE_KEY(user.id));

  let streaks = cached_streaks ? JSON.parse(cached_streaks) : null;

  if (!streaks) {
    streaks = await prisma.streak.findMany({
      where: {
        userId: user.id,
      },
    });
    redisClient.set(STREAKS_CACHE_KEY(user.id), JSON.stringify(streaks));
  }

  return streaks;
};

// Service for create new
const create_one_into_db = async (user: JwtPayload) => {
  // Helper function to calculate one day in milliseconds
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
  const cached_streaks = await redisClient.get(STREAKS_CACHE_KEY(user.id));

  let streak = cached_streaks ? JSON.parse(cached_streaks) : null;

  if (!streak) {
    streak = await prisma.streak.findFirst({
      where: { userId: user.id as string },
    });
  }

  // Get current date and last active date (normalized to remove time part)
  const today = new Date(new Date().toDateString()).getTime();
  const lastActive = streak?.lastActive
    ? new Date(new Date(streak.lastActive).toDateString()).getTime()
    : 0;

  // Default values for current streak and longest streak
  let currentStreak = 1;
  let longestStreak = streak ? Number(streak.longestStreak) : 1;

  // If streak exists, check if the user has maintained the streak
  if (streak) {
    if (lastActive + ONE_DAY_IN_MS == today) {
      currentStreak = Number(streak.currentStreak) + 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    }

    await redisClient.del(STREAKS_CACHE_KEY(user.id));
    // Update streak data
    await prisma.streak.update({
      data: {
        currentStreak,
        longestStreak,
        lastActive: new Date(),
        userId: user.id,
      },
      where: { id: streak.id },
    });
  }

  // If no streak exists, create a new one
  if (!streak) {
    await prisma.streak.create({
      data: {
        currentStreak: 1,
        longestStreak: 1,
        lastActive: new Date(),
        userId: user.id,
      },
    });
  }
  streak = await prisma.streak.findFirst({
    where: { userId: user.id as string },
  });
  redisClient.set(STREAKS_CACHE_KEY(user.id), JSON.stringify(streak));

  return streak;
};
export const streak_services = {
  fetch_all_from_db,
  create_one_into_db,
};

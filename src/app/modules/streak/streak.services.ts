import { JwtPayload } from "jsonwebtoken";
import prisma from "../../utils/prisma_client";

// Service for create new
// Helper function to calculate one day in milliseconds
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

const create_one_into_db = async (user: JwtPayload) => {
  // Fetch streak data for the user
  const streak = await prisma.streak.findFirst({
    where: { userId: user.id as string },
  });

  // Get current date and last active date (normalized to remove time part)
  const today = new Date(new Date().toDateString()).getTime();
  const lastActive = streak?.lastActive ? new Date(streak.lastActive.toDateString()).getTime() : 0;

  // Default values for current streak and longest streak
  let currentStreak = 1;
  let longestStreak = streak ? Number(streak.longestStreak) : 1;

  // If streak exists, check if the user has maintained the streak
  if (streak) {
    
    if (lastActive + ONE_DAY_IN_MS == today) {
      currentStreak = Number(streak.currentStreak) + 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    }
    
    // Update streak data
    const updatedStreak = await prisma.streak.update({
      data: {
        currentStreak,
        longestStreak,
        lastActive: new Date(),
        userId: user.id,
      },
      where: { id: streak.id },
    });

    return updatedStreak;
  }

  // If no streak exists, create a new one
  const newStreak = await prisma.streak.create({
    data: {
      currentStreak: 1,
      longestStreak: 1,
      lastActive: new Date(),
      userId: user.id,
    },
  });

  return newStreak;
};
export const streak_services = {
  create_one_into_db,
};

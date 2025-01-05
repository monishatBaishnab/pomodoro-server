import { Badge, UserBadge } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { cloudinary_uploader } from "../../middlewares/upload";
import prisma from "../../utils/prisma_client";
import redisClient from "../../redis/redisClient";
import { TFile } from "../../types";

const USER_BADGES_CACHE_KEY = (user_id: string) => `badges:${user_id}:data`;

// Service for fetching all badges
const fetch_all_from_db = async (user: JwtPayload) => {
  const badges = await prisma.badge.findMany({
    orderBy: { createdAt: "asc" },
  });

  return badges;
};
// Service for fetching all badges
const fetch_user_badge_from_db = async (user: JwtPayload) => {
  await redisClient.del(USER_BADGES_CACHE_KEY(user.id));
  const cached_badges = await redisClient.get(USER_BADGES_CACHE_KEY(user.id));

  let badges = cached_badges ? JSON.parse(cached_badges) : null;

  if (!badges?.length) {
    badges = await prisma.userBadge.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        badge: {
          select: { id: true, name: true, description: true, icon: true },
        },
      },
    });

    await redisClient.set(USER_BADGES_CACHE_KEY(user.id), JSON.stringify(badges), { EX: 3600 });
  }

  return badges;
};

// Service for create new
const create_one_into_db = async (payload: Badge, user: JwtPayload, file: TFile) => {
  const badge_data = { ...payload };

  // Upload image in cloudinary and set the image link in user data
  const uploaded_image_info = await cloudinary_uploader(file);
  if (uploaded_image_info?.secure_url) {
    badge_data.icon = uploaded_image_info.secure_url;
  }

  // For non-vendor users, simply create the user record
  const created_badge = await prisma.badge.create({
    data: badge_data,
  });

  return created_badge;
};

const create_user_badge = async (payload: UserBadge, user: JwtPayload) => {
  const created_badge = await prisma.userBadge.create({
    data: { badgeId: payload.badgeId, userId: payload.userId },
  });
  return created_badge;
};

export const badge_services = {
  fetch_all_from_db,
  fetch_user_badge_from_db,
  create_one_into_db,
  create_user_badge,
};

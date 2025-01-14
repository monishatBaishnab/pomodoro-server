import { FocusSession } from "@prisma/client";
import prisma from "../../utils/prisma_client";
import { JwtPayload } from "jsonwebtoken";
import redisClient from "../../redis/redisClient";

export const FOCUS_SESSION_CACHE_KEY = (user_id: string) => `focus_session:${user_id}:data`;

// Service for create new focus session
const fetch_metric_from_db = async (user: JwtPayload) => {

  const cached_focus_metric = await redisClient.get(FOCUS_SESSION_CACHE_KEY(user.id));
 
  let sessions = cached_focus_metric ? JSON.parse(cached_focus_metric) : null;

  if (!sessions) {
    sessions = await prisma.focusSession.findMany({
      where: { userId: user.id },
      orderBy: { timestamps: "asc" },
    });

    await redisClient.set(FOCUS_SESSION_CACHE_KEY(user.id), JSON.stringify(sessions), { EX: 3600 });
  }

  const total_duration = sessions?.reduce((sum: number, session: FocusSession) => {
    return (sum += Number(session.duration));
  }, 0);
  return { sessions, total_duration, total_sessions: sessions?.length };
};

// Service for create new focus session
const create_one_into_db = async (payload: Pick<FocusSession, "duration" | "userId">) => {
  const { duration, userId } = payload ?? {};

  await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  const created_session = await prisma.focusSession.create({
    data: { duration: Number(duration), userId },
  });

  await redisClient.del(FOCUS_SESSION_CACHE_KEY(payload.userId));

  const sessions = await prisma.focusSession.findMany({
    where: { userId: payload.userId },
    orderBy: { timestamps: "desc" },
  });

  await redisClient.set(FOCUS_SESSION_CACHE_KEY(payload.userId), JSON.stringify(sessions), { EX: 3600 });

  return created_session;
};

export const focus_session_services = {
  fetch_metric_from_db,
  create_one_into_db,
};

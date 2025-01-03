import { FocusSession } from "@prisma/client";
import prisma from "../../utils/prisma_client";
import { JwtPayload } from "jsonwebtoken";

// Service for create new focus session
const fetch_metric_from_db = async (user: JwtPayload) => {
  const sessions = await prisma.focusSession.findMany({
    where: { userId: user.id },
    orderBy: { timestamps: "desc" },
  });
  const total_duration = sessions?.reduce((sum, session) => {
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

  return created_session;
};

export const focus_session_services = {
  fetch_metric_from_db,
  create_one_into_db,
};

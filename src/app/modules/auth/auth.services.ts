import { User } from "@prisma/client";
import { TFile } from "../../types";
import prisma from "../../utils/prisma_client";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { local_config } from "../../config";
import http_error from "../../errors/http_error";
import { generate_token, sanitize_token_data } from "../../utils/jwt";
import { Secret } from "jsonwebtoken";
import { cloudinary_uploader } from "../../middlewares/upload";
import redisClient from "../../redis/redisClient";

const USER_CACHE_KEY = (userId: string) => `user:${userId}:data`;

// Service for login user
const login = async (payload: User) => {
  const cachedUser = await redisClient.get(USER_CACHE_KEY(payload.id));

  // Parse json data from cached string
  let user_info = cachedUser ? JSON.parse(cachedUser) : null;

  await redisClient.del(USER_CACHE_KEY(payload.id));

  if (!cachedUser) {
    user_info = await prisma.user.findUniqueOrThrow({
      where: { email: payload.email, isDeleted: false },
    });

    await redisClient.set(USER_CACHE_KEY(payload.id), JSON.stringify(user_info));
  }

  const is_match_pass = await bcrypt.compare(String(payload.password), user_info.password);

  if (!is_match_pass) {
    throw new http_error(httpStatus.UNAUTHORIZED, "Password not matched.");
  }

  const token_data = sanitize_token_data(user_info);

  const token = generate_token(token_data, local_config.jwt_secret as string);

  return { token };
};

// Service for register new user and insert user data in db
const register = async (payload: User, file: TFile) => {
  const user_data = { ...payload };

  // Hashed password and set this in user data
  const hashed_password = await bcrypt.hash(
    String(payload.password),
    Number(local_config.bcrypt_salt)
  );
  user_data.password = hashed_password;
  // Upload image in cloudinary and set the image link in user data
  const uploaded_image_info = await cloudinary_uploader(file);
  if (uploaded_image_info?.secure_url) {
    user_data.profile_picture = uploaded_image_info.secure_url;
  }

  // For non-vendor users, simply create the user record
  const created_user = await prisma.user.create({
    data: user_data,
  });

  await redisClient.set(USER_CACHE_KEY(payload.id), JSON.stringify(created_user));

  const token_data = sanitize_token_data(created_user);

  const token = generate_token(token_data, local_config.jwt_secret as Secret);

  return { token };
};

export const auth_services = {
  login,
  register,
};

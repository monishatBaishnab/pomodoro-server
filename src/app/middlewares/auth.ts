import { NextFunction, Request, Response } from "express";
import catch_async from "../utils/catch_async";
import http_error from "../errors/http_error";
import { local_config } from "../config";
import httpStatus from "http-status";
import { verify_token } from "../utils/jwt";

const auth = catch_async((req: Request, res: Response, next: NextFunction) => {
  const token = req?.headers?.authorization;

  if (!token) {
    throw new http_error(httpStatus.UNAUTHORIZED, "You are not authorized.");
  }

  const verified_user = verify_token(token, local_config.jwt_secret as string);

  req.user = verified_user;
  next();
});

export default auth;

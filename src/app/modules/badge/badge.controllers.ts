import httpStatus from "http-status";
import catch_async from "../../utils/catch_async";
import send_response from "../../utils/send_response";
import { badge_services } from "./badge.services";

// Controller for create Badge
const fetch_all = catch_async(async (req, res) => {
  // Creating Badge
  const result = await badge_services.fetch_all_from_db(req.user);

  // Send response to client
  send_response(res, {
    message: "Badges Fetched.",
    status: httpStatus.OK,
    data: result,
  });
});
// Controller for create Badge
const fetch_user_badges = catch_async(async (req, res) => {
  // Creating Badge
  const result = await badge_services.fetch_user_badge_from_db(req.user);

  // Send response to client
  send_response(res, {
    message: "Badges Fetched.",
    status: httpStatus.OK,
    data: result,
  });
});

// Controller for create Badge
const create_one = catch_async(async (req, res) => {
  // Creating Badge
  const result = await badge_services.create_one_into_db(req.body, req.user, req.file);

  // Send response to client
  send_response(res, {
    message: "Badge Created.",
    status: httpStatus.CREATED,
    data: result,
  });
});

// Controller for create Badge
const create_user_badges = catch_async(async (req, res) => {
  // Creating Badge
  const result = await badge_services.create_user_badge(req.body, req.user);

  // Send response to client
  send_response(res, {
    message: "User Badge Created.",
    status: httpStatus.CREATED,
    data: result,
  });
});

export const badge_controllers = {
  fetch_all,
  fetch_user_badges,
  create_one,
  create_user_badges
};

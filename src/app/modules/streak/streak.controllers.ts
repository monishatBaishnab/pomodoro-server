import httpStatus from "http-status";
import catch_async from "../../utils/catch_async";
import send_response from "../../utils/send_response";
import { streak_services } from "./streak.services";

// Controller for create streak
const create_one = catch_async(async (req, res) => {
  // Creating Streak
  const result = await streak_services.create_one_into_db(req.user);

  // Send response to client
  send_response(res, {
    message: "Streak Created.",
    status: httpStatus.CREATED,
    data: result,
  });
});

export const streak_controllers = {
  create_one,
};

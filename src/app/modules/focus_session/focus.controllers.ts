import httpStatus from "http-status";
import catch_async from "../../utils/catch_async";
import send_response from "../../utils/send_response";
import { focus_session_services } from "./focus.services";

// Controller for create focus session
const fetch_metric = catch_async(async (req, res) => {
  // Creating focus session
  const result = await focus_session_services.fetch_metric_from_db(req.user);

  // Send response to client
  send_response(res, {
    message: "Focus Metrics Fetched.",
    status: httpStatus.OK,
    data: result,
  });
});

// Controller for create focus session
const create_one = catch_async(async (req, res) => {
  // Creating focus session
  const result = await focus_session_services.create_one_into_db(req.body);

  // Send response to client
  send_response(res, {
    message: "Focus Session Created.",
    status: httpStatus.CREATED,
    data: result,
  });
});

export const focus_session_controllers = {
  fetch_metric,
  create_one,
};

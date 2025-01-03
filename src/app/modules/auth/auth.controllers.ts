import httpStatus from "http-status";
import catch_async from "../../utils/catch_async";
import send_response from "../../utils/send_response";
import { auth_services } from "./auth.services";

// Controller for login
const login = catch_async(async (req, res) => {
  // Logging user
  const result = await auth_services.login(req.body);

  // Send response to client
  send_response(res, {
    message: "Login Successful.",
    status: httpStatus.OK,
    data: result,
  });
});

// Controller for register user
const register = catch_async(async (req, res) => {
  // Creating user
  const result = await auth_services.register(req.body, req.file);

  // Send response to client
  send_response(res, {
    message: "User created.",
    status: httpStatus.CREATED,
    data: result,
  });
});

export const auth_controllers = {
  login,
  register,
};

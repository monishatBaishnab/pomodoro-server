import { Router } from "express";
import { auth_routes } from "../modules/auth/auth.routes";
import { focus_metric_routes, focus_session_routes } from "../modules/focus_session/focus.routes";

type TRoutes = {
  path: string;
  element: Router;
}[];

const routes: TRoutes = [
  {
    path: "/auth",
    element: auth_routes,
  },
  {
    path: "/focus-session",
    element: focus_session_routes,
  },
  {
    path: "/focus-metric",
    element: focus_metric_routes,
  },
];

const router = Router();

routes.forEach((route) => router.use(route.path, route.element));

export const app_routes = router;

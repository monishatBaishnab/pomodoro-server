import { Router } from "express";
import { auth_routes } from "../modules/auth/auth.routes";

type TRoutes = {
  path: string;
  element: Router;
}[];

const routes: TRoutes = [
  {
    path: "/auth",
    element: auth_routes,
  },
];

const router = Router();

routes.forEach((route) => router.use(route.path, route.element));

export const app_routes = router;

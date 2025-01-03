import { Router } from "express";

type TRoutes = {
  path: string;
  element: Router;
}[];

const routes: TRoutes = [];

const router = Router();

routes.forEach((route) => router.use(route.path, route.element));

export const app_routes = router;

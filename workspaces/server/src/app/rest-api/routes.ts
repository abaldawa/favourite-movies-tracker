/**
 * @author Abhijit Baldawa
 */

import { Router } from "express";
import { logger } from "../logger";
import { moviesModuleRoutes } from "../modules/movies/routes";
import { requestHandler } from "../utils/rest-api/middlewares";

/**
 * @public
 *
 * Adds all the routes of all the modules and responds with a root router
 */
const getRootRouter = () => {
  const rootRouter = Router();
  const routes = [...moviesModuleRoutes];

  routes.forEach((route) => {
    rootRouter[route.method](route.path, requestHandler(route, logger));
  });

  return rootRouter;
};

export { getRootRouter };

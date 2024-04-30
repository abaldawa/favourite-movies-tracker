/**
 * @author Abhijit Baldawa
 */

import { server as commonServer } from "@favorite-movies-tracker/common";
import { ControllerFunction, RouteConfig } from "../../utils/rest-api/types";
import * as controller from "./controller";

import movieRestApis = commonServer.modules.movies.restApi;

const moviesModuleRoutes: RouteConfig[] = [
  {
    method: movieRestApis.SearchMoviesApi.method,
    path: movieRestApis.SearchMoviesApi.path,
    maxAcceptableResponseTimeInMs: 700,
    controllers: [controller.searchMoviesByTitle as ControllerFunction],
  },
  {
    method: movieRestApis.GetAllFavoriteMoviesApi.method,
    path: movieRestApis.GetAllFavoriteMoviesApi.path,
    maxAcceptableResponseTimeInMs: 100,
    controllers: [controller.getAllFavoriteMovies as ControllerFunction],
  },
  {
    method: movieRestApis.CreateOrUpvoteFavoriteMovieApi.method,
    path: movieRestApis.CreateOrUpvoteFavoriteMovieApi.path,
    maxAcceptableResponseTimeInMs: 100,
    controllers: [controller.createOrUpvoteFavoriteMovie as ControllerFunction],
  },
  {
    method: movieRestApis.UpvoteFavoriteMovieApi.method,
    path: movieRestApis.UpvoteFavoriteMovieApi.path,
    maxAcceptableResponseTimeInMs: 100,
    controllers: [controller.upvoteFavoriteMovie as ControllerFunction],
  },
];

export { moviesModuleRoutes };

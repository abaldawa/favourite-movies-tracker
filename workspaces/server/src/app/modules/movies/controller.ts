/**
 * @author Abhijit Baldawa
 */

import { StatusCodes } from "http-status-codes";
import { server as commonServer } from "@favorite-movies-tracker/common";
import { ControllerFunction } from "../../utils/rest-api/types";
import { NotfoundError } from "../../utils/errors/error-types/not-found-error";
import { ValidationError } from "../../utils/errors/error-types/validation-error";
import * as service from "./service";

import movieRestApis = commonServer.modules.movies.restApi;

const searchMoviesByTitle: ControllerFunction<
  movieRestApis.SearchMoviesApi.Response,
  never,
  never,
  movieRestApis.SearchMoviesApi.QueryParams
> = async (args) => {
  const { query } = args;

  // 1. validate query params
  const validationResult =
    await movieRestApis.SearchMoviesApi.QueryParamsSchema.safeParseAsync(query);

  if (!validationResult.success) {
    throw new ValidationError(
      "Query params validation failed",
      validationResult.error.format()
    );
  }

  // 2. Search movies by title and provided page number
  const foundMovies = await service.searchMoviesByTitle({
    page: +query.page,
    title: query.title,
  });

  return {
    statusCode: StatusCodes.OK,
    response: {
      type: "success:json",
      data: foundMovies,
    },
  };
};

const createOrUpvoteFavoriteMovie: ControllerFunction<
  movieRestApis.CreateOrUpvoteFavoriteMovieApi.Response,
  never,
  movieRestApis.CreateOrUpvoteFavoriteMovieApi.ParamsObj
> = async (args) => {
  const {
    params: { imdbId },
  } = args;

  const response = await service.createOrUpvoteFavoriteMovie(imdbId);

  return {
    statusCode: StatusCodes.OK,
    response: {
      type: "success:json",
      data: response,
    },
  };
};

const upvoteFavoriteMovie: ControllerFunction<
  movieRestApis.UpvoteFavoriteMovieApi.Response,
  never,
  movieRestApis.UpvoteFavoriteMovieApi.ParamsObj
> = (args) => {
  const {
    params: { imdbId },
  } = args;

  const foundAndUpvotedMovie = service.upvoteFavoriteMovie(imdbId);

  if (!foundAndUpvotedMovie) {
    throw new NotfoundError(`movie with imdbId = '${imdbId}' not found in DB`);
  }

  return {
    statusCode: StatusCodes.OK,
    response: {
      type: "success:json",
      data: foundAndUpvotedMovie,
    },
  };
};

const getAllFavoriteMovies: ControllerFunction<
  movieRestApis.GetAllFavoriteMoviesApi.Response,
  never,
  never,
  movieRestApis.GetAllFavoriteMoviesApi.QueryParams
> = async (args) => {
  const { query } = args;

  // 1. validate query params
  const validationResult =
    await movieRestApis.GetAllFavoriteMoviesApi.QueryParamsSchema.safeParseAsync(
      query
    );

  if (!validationResult.success) {
    throw new ValidationError(
      "Query params validation failed",
      validationResult.error.format()
    );
  }

  // 2. Get all favorite movies
  const response = service.getAllFavoriteMovies(query?.sortByUpvotes);

  return {
    statusCode: StatusCodes.OK,
    response: {
      type: "success:json",
      data: response,
    },
  };
};

export {
  searchMoviesByTitle,
  createOrUpvoteFavoriteMovie,
  upvoteFavoriteMovie,
  getAllFavoriteMovies,
};

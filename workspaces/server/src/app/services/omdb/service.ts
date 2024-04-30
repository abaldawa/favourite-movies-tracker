/**
 * @author Abhijit Baldawa
 */

import axios, { AxiosError } from "axios";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { utils as commonUtils } from "@favorite-movies-tracker/common/";
import { getEnvironmentVariables } from "../../config/env";
import { MoviesSearchSchema, MoviesSearch } from "./types/movie/movies-search";
import { MovieDetailsSchema, MovieDetails } from "./types/movie/movie-details";
import {
  OmdbApiErrorResponse,
  OmdbApiErrorResponseSchema,
} from "./types/omdb-api-error-response";
import { OmdbClientError } from "./error-types/omdb-client-error";

import commonErrors = commonUtils.commonErrors;

const OMDB_BASE_URL = "https://omdbapi.com";

/**
 * @private
 *
 * Returns an Omdb error type
 *
 * @param error - Error while fetching data from Omdb API
 * @param errorMsg - Error message to prefix
 * @returns
 */
const getOmdbClientError = (error: unknown, errorMsg: string) => {
  if (error instanceof z.ZodError) {
    return new OmdbClientError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `${errorMsg}. Data validation failed`,
      error.format()
    );
  }

  if (error instanceof AxiosError && error.isAxiosError) {
    const {
      statusCode,
      errorMessage: serverErrorMessage,
      details,
    } = commonErrors.axios.extractDetailsFromAxiosError(error);

    return new OmdbClientError(
      statusCode,
      `${errorMsg} -> ${serverErrorMessage}`,
      details
    );
  }

  if (error instanceof Error) {
    return new OmdbClientError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `${errorMsg}. Reason -> ${error.message}`
    );
  }

  return new OmdbClientError(
    StatusCodes.INTERNAL_SERVER_ERROR,
    `${errorMsg}. Reason -> ${error}`
  );
};

// Search movies by title Api
const MoviesSearchApiResponseSchema = z.discriminatedUnion("Response", [
  MoviesSearchSchema,
  OmdbApiErrorResponseSchema,
]);

const searchMoviesByTitle = async (args: {
  title: string;
  page: number;
}): Promise<MoviesSearch | OmdbApiErrorResponse> => {
  const { title, page } = args;

  try {
    const { OMDB_API_KEY } = getEnvironmentVariables();
    const response = await axios.get<MoviesSearch | OmdbApiErrorResponse>(
      `${OMDB_BASE_URL}?type=movie&apikey=${OMDB_API_KEY}&s=${title}&page=${page}`
    );

    await MoviesSearchApiResponseSchema.parseAsync(response.data);

    return response.data;
  } catch (error: unknown) {
    throw getOmdbClientError(
      error,
      `Error searching movies by title = '${title}'`
    );
  }
};

// Get movie by omdbId Api
const MovieDetailsApiResponseSchema = z.discriminatedUnion("Response", [
  MovieDetailsSchema,
  OmdbApiErrorResponseSchema,
]);

const getMovieByImdbId = async (imdbId: string): Promise<MovieDetails> => {
  try {
    const { OMDB_API_KEY } = getEnvironmentVariables();
    const response = await axios.get<MovieDetails | OmdbApiErrorResponse>(
      `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbId}`
    );

    await MovieDetailsApiResponseSchema.parseAsync(response.data);

    if (response.data.Response === "False") {
      throw new OmdbClientError(StatusCodes.BAD_REQUEST, response.data.Error);
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof OmdbClientError) {
      throw error;
    }

    throw getOmdbClientError(
      error,
      `Error fetching movie by imdbId = '${imdbId}'`
    );
  }
};

export { searchMoviesByTitle, getMovieByImdbId };

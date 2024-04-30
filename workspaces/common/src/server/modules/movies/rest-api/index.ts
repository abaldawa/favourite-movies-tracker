/**
 * @author Abhijit Baldawa
 */

import { z } from "zod";
import * as restApiTypes from "./types";
import { SERVICE_ROOT_PATH } from "../../../rest-api/constants";
import { ApiSuccessResponse } from "../../../utils/rest-api/types";
import { UrlToParamObj } from "../../../utils/rest-api/types/url-utils";
import {
  FavoriteMovieDbRecordSchema,
  FavoriteMovieDbRecord,
} from "../../../models/favorite-movie";
import axios from "axios";

const MODULE_PATH = "/movies";

namespace SearchMoviesApi {
  export const method = "get";

  export const path = `${SERVICE_ROOT_PATH}${MODULE_PATH}/search` as const;

  // Query params
  export const QueryParamsSchema = z
    .object({
      title: z.string().nonempty(),
      page: z.string().refine(
        (page) => {
          if (!/^[0-9]+$/.test(page)) {
            return false;
          }

          return +page > 0;
        },
        { message: "Must be positive integer" }
      ),
    })
    .strict();

  export type QueryParams = z.infer<typeof QueryParamsSchema>;

  export const getUrl = (
    queryParams: Omit<QueryParams, "page"> & { page: number }
  ) => {
    const queryParamsStr = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    return `${path}?${queryParamsStr}`;
  };

  // Api response
  const ErrorResponseSchema = z
    .object({
      /**
       * Failed response status
       */
      Response: z.literal("False"),

      /**
       * Error reason
       *
       * Ex: "Too many results"
       */
      Error: z.string().nonempty(),
    })
    .strict();

  export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

  export const ResponseSchema = z.discriminatedUnion("Response", [
    ErrorResponseSchema,
    restApiTypes.moviesSearch.MoviesSearchSchema,
  ]);
  export type Response = z.infer<typeof ResponseSchema>;
  export type ApiResponse = ApiSuccessResponse<Response>;
}

namespace CreateOrUpvoteFavoriteMovieApi {
  export const method = "post";

  export const path =
    `${SERVICE_ROOT_PATH}${MODULE_PATH}/favorite/:imdbId/createOrUpvote` as const;

  export type ParamsObj = UrlToParamObj<typeof path>;

  export const getUrl = (paramsObj: ParamsObj) =>
    path.replace(":imdbId", paramsObj.imdbId);

  export const ResponseSchema = FavoriteMovieDbRecordSchema;
  export type Response = FavoriteMovieDbRecord;
  export type ApiResponse = ApiSuccessResponse<Response>;
}

namespace UpvoteFavoriteMovieApi {
  export const method = "patch";

  export const path =
    `${SERVICE_ROOT_PATH}${MODULE_PATH}/favorite/:imdbId/upvote` as const;

  export type ParamsObj = UrlToParamObj<typeof path>;

  export const getUrl = (paramsObj: ParamsObj) =>
    path.replace(":imdbId", paramsObj.imdbId);

  export const ResponseSchema = FavoriteMovieDbRecordSchema;
  export type Response = FavoriteMovieDbRecord;
  export type ApiResponse = ApiSuccessResponse<Response>;
}

namespace GetAllFavoriteMoviesApi {
  export const method = "get";

  export const path = `${SERVICE_ROOT_PATH}${MODULE_PATH}/favorite` as const;

  // Query params
  export const QueryParamsSchema = z
    .object({
      sortByUpvotes: z.union([z.literal("ASC"), z.literal("DES")]).optional(),
    })
    .strict()
    .optional();

  export type QueryParams = z.infer<typeof QueryParamsSchema>;

  export const getUrl = (queryParams: QueryParams) => {
    if (!queryParams || !Object.keys(queryParams).length) {
      return path;
    }

    const queryParamsStr = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    return `${path}?${queryParamsStr}`;
  };

  // Api response
  export const ResponseSchema = FavoriteMovieDbRecordSchema.array();
  export type Response = FavoriteMovieDbRecord[];
  export type ApiResponse = ApiSuccessResponse<Response>;
}

/**
 * Readily available REST Api methods to query data
 * from the backend API's
 */
const query = {
  getAllFavoriteMovies: async (
    queryParams?: GetAllFavoriteMoviesApi.QueryParams,
    baseUrl = ""
  ): Promise<GetAllFavoriteMoviesApi.Response> => {
    const response = await axios.get<GetAllFavoriteMoviesApi.ApiResponse>(
      `${baseUrl}${GetAllFavoriteMoviesApi.getUrl(queryParams)}`
    );

    await GetAllFavoriteMoviesApi.ResponseSchema.parseAsync(response.data.data);

    return response.data.data;
  },

  searchMovies: async (
    queryParams: Omit<SearchMoviesApi.QueryParams, "page"> & { page: number },
    abortSignal?: AbortSignal,
    baseUrl = ""
  ): Promise<SearchMoviesApi.Response> => {
    const response = await axios.get<SearchMoviesApi.ApiResponse>(
      `${baseUrl}${SearchMoviesApi.getUrl(queryParams)}`,
      {
        signal: abortSignal,
      }
    );

    await SearchMoviesApi.ResponseSchema.parseAsync(response.data.data);

    return response.data.data;
  },

  createOrUpvoteFavoriteMovie: async (
    paramsObj: CreateOrUpvoteFavoriteMovieApi.ParamsObj,
    baseUrl = ""
  ): Promise<CreateOrUpvoteFavoriteMovieApi.Response> => {
    const response =
      await axios.post<CreateOrUpvoteFavoriteMovieApi.ApiResponse>(
        `${baseUrl}${CreateOrUpvoteFavoriteMovieApi.getUrl(paramsObj)}`
      );

    await CreateOrUpvoteFavoriteMovieApi.ResponseSchema.parseAsync(
      response.data.data
    );

    return response.data.data;
  },

  upvoteFavoriteMovie: async (
    paramsObj: UpvoteFavoriteMovieApi.ParamsObj,
    baseUrl = ""
  ): Promise<UpvoteFavoriteMovieApi.Response> => {
    const response = await axios.patch<UpvoteFavoriteMovieApi.ApiResponse>(
      `${baseUrl}${UpvoteFavoriteMovieApi.getUrl(paramsObj)}`
    );

    await UpvoteFavoriteMovieApi.ResponseSchema.parseAsync(response.data.data);

    return response.data.data;
  },
} as const;

export {
  SearchMoviesApi,
  CreateOrUpvoteFavoriteMovieApi,
  GetAllFavoriteMoviesApi,
  UpvoteFavoriteMovieApi,
  restApiTypes as types,
  query,
};

/**
 * @author Abhijit Baldawa
 */

import { StatusCodes } from "http-status-codes";
import { AxiosError } from "axios";
import { z } from "zod";
import { utils as commonUtils } from "@favorite-movies-tracker/common/";
import { ValidationError } from "./error-types/validation-error";
import { OmdbClientError } from "../../services/omdb/error-types/omdb-client-error";
import { NotfoundError } from "./error-types/not-found-error";

import commonErrors = commonUtils.commonErrors;

type KnownError =
  | ValidationError
  | OmdbClientError
  | NotfoundError
  | z.ZodError
  | AxiosError;

/**
 * @public
 *
 * Central error handler for REST api calls which inspects
 * error and returns appropriate status code and error message
 *
 * @param error
 * @param errMsgIfNoMatch
 */
const getErrorDetails = (error: unknown, errMsgIfNoMatch: string) => {
  let statusCode: StatusCodes;
  let errorMessage: string;
  let details: unknown;

  if (error instanceof z.ZodError) {
    [statusCode, errorMessage, details] = [
      StatusCodes.BAD_REQUEST,
      "Validation error",
      error.format(),
    ];
  } else if (error instanceof NotfoundError) {
    [statusCode, errorMessage, details] = [
      StatusCodes.NOT_FOUND,
      error.message,
      error.details,
    ];
  } else if (error instanceof OmdbClientError) {
    [statusCode, errorMessage, details] = [
      error.statusCode,
      error.message,
      error.details,
    ];
  } else if (error instanceof ValidationError) {
    [statusCode, errorMessage, details] = [
      StatusCodes.BAD_REQUEST,
      error.message,
      error.details,
    ];
  } else if (error instanceof AxiosError && error.isAxiosError) {
    ({ statusCode, errorMessage, details } =
      commonErrors.axios.extractDetailsFromAxiosError(error));
  } else if (error instanceof Error) {
    [statusCode, errorMessage] = [
      StatusCodes.INTERNAL_SERVER_ERROR,
      `${errMsgIfNoMatch}. Reason -> ${error.message}`,
    ];
  } else {
    [statusCode, errorMessage] = [
      StatusCodes.INTERNAL_SERVER_ERROR,
      `${errMsgIfNoMatch}. Reason -> ${error}`,
    ];
  }

  return { statusCode, errorMessage, details };
};

const isKnownError = (error: unknown): error is KnownError =>
  error instanceof z.ZodError ||
  error instanceof NotfoundError ||
  error instanceof OmdbClientError ||
  error instanceof ValidationError ||
  error instanceof AxiosError;

export { KnownError, getErrorDetails, isKnownError };

/**
 * @author Abhijit Baldawa
 */

import { AxiosError } from "axios";
import { z } from "zod";
import { utils as commonUtils } from "@favorite-movies-tracker/common/";

import commonErrors = commonUtils.commonErrors;

/**
 * @public
 *
 * Central error handler which inspects
 * error and returns appropriate status code,
 * details and error message
 *
 * @param error
 * @param errMsgIfNoMatch
 */
const getErrorDetails = (
  error: unknown,
  errMsgIfNoMatch: string
): {
  httpResponseStatusCode?: number;
  errorMessage: string;
  details?: unknown;
} => {
  let httpResponseStatusCode: number | undefined;
  let errorMessage: string;
  let details: unknown;

  if (error instanceof z.ZodError) {
    [errorMessage, details] = ["Invalid api response", error.format()];
  } else if (error instanceof AxiosError && error.isAxiosError) {
    ({
      statusCode: httpResponseStatusCode,
      errorMessage,
      details,
    } = commonErrors.axios.extractDetailsFromAxiosError(error));
  } else if (error instanceof Error) {
    errorMessage = `${errMsgIfNoMatch}. Reason -> ${error.message}`;
  } else {
    errorMessage = `${errMsgIfNoMatch}. Reason (unknown error) ->  ${error}`;
  }

  return { errorMessage, details, httpResponseStatusCode };
};

export { getErrorDetails };

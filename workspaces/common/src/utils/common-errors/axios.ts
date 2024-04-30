/**
 * @author Abhijit Baldawa
 */

import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../server/utils/rest-api/types";

const extractDetailsFromAxiosError = (
  error: AxiosError<ApiErrorResponse | undefined>
) => {
  let statusCode: number;
  let errorMessage: string;
  let details: unknown;

  // If there is a response from server then inspect and extract the response
  if (error.response) {
    if (error.response.data?.error?.code) {
      // This is an error response from our server
      ({
        code: statusCode,
        message: errorMessage,
        details,
      } = error.response.data.error);
    } else {
      // This is NOT an error response from our server
      statusCode = error.response.status;
      errorMessage = error.message;
    }
  } else {
    /**
     * There is no response from the server.
     * In this case we return gateway timeout error
     */
    statusCode = 504;
    errorMessage = error.message;
  }

  return { statusCode, errorMessage, details };
};

export { extractDetailsFromAxiosError };

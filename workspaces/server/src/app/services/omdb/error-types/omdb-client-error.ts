/**
 * @author Abhijit Baldawa
 */
import { StatusCodes } from "http-status-codes";

class OmdbClientError extends Error {
  public statusCode: StatusCodes;
  public details?: unknown;

  constructor(statusCode: StatusCodes, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export { OmdbClientError };

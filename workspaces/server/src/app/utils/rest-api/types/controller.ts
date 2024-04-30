/**
 * @author Abhijit Baldawa
 */

import { StatusCodes } from "http-status-codes";
import { server as commonServer } from "@favorite-movies-tracker/common/";

import restApiShared = commonServer.utils.restApi;

/**
 * Success REST api controller response
 */
interface ControllerSuccessDataResponse<ResponseDataPayload>
  extends restApiShared.types.ApiSuccessResponse<ResponseDataPayload> {
  type: "success:json";
}

/**
 * Error REST api controller response
 */
interface ControllerErrorDataResponse
  extends restApiShared.types.ApiErrorResponse {
  type: "error:json";
}

/**
 * REST api controller return type
 */
interface ControllerReturnType<ResponseDataPayload> {
  statusCode: StatusCodes;
  response?:
    | ControllerSuccessDataResponse<ResponseDataPayload>
    | ControllerErrorDataResponse;
}

/**
 * REST Api controller function definition.
 */
type ControllerFunction<
  ResponseData = unknown,
  Body = unknown,
  Params = unknown,
  Query = unknown,
> = (args: {
  body: Body;
  params: Params;
  query: Query;
}) =>
  | Promise<ControllerReturnType<ResponseData> | void>
  | ControllerReturnType<ResponseData>
  | void;

export { ControllerFunction, ControllerReturnType };

/**
 * @author Abhijit Baldawa
 */

import "dotenv/config";
import { z } from "zod";
import { ValidationError } from "../utils/errors/error-types/validation-error";

const EntertainmentServiceEnvVariablesSchema = z.object({
  NODE_ENV: z
    .enum(["production", "development"])
    .optional()
    .default("development"),
  PORT: z.coerce
    .number()
    .int()
    .positive()
    .min(1025)
    .max(65536)
    .optional()
    .default(3000),
  OMDB_API_KEY: z.string().nonempty(),
});

interface EntertainmentServiceEnvVariables
  extends z.infer<typeof EntertainmentServiceEnvVariablesSchema> {}

let entertainmentServiceEnvVariables:
  | EntertainmentServiceEnvVariables
  | undefined;

const getEnvironmentVariables = (): EntertainmentServiceEnvVariables => {
  if (entertainmentServiceEnvVariables) {
    return entertainmentServiceEnvVariables;
  }

  const validationResult = EntertainmentServiceEnvVariablesSchema.safeParse(
    process.env
  );

  if (!validationResult.success) {
    throw new ValidationError(
      `Environment Variables validation failed`,
      validationResult.error.format()
    );
  }
  return validationResult.data;
};

export { getEnvironmentVariables };

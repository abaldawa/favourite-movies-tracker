/**
 * @author Abhijit Baldawa
 */

import { z } from "zod";

/**
 * Failed OMDB Api response
 */
const OmdbApiErrorResponseSchema = z
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

interface OmdbApiErrorResponse
  extends z.infer<typeof OmdbApiErrorResponseSchema> {}

export { OmdbApiErrorResponseSchema, OmdbApiErrorResponse };

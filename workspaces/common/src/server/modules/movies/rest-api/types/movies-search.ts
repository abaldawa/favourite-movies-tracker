/**
 * @author Abhijit Baldawa
 */

import { z } from "zod";

const MoviesSearchSchema = z
  .object({
    Search: z
      .object({
        /**
         * Full title of the movie
         */
        Title: z.string().nonempty(),

        /**
         * Movie release year
         *
         * Ex: "1990"
         */
        Year: z.string().nonempty(),

        /**
         * Unique ID of the movie
         *
         * Ex: "tt5024912"
         */
        imdbID: z.string().nonempty(),

        /**
         * The record is of movie type
         */
        Type: z.literal("movie"),

        /**
         * Poster URL of the movie
         *
         * Ex: `"https://image/url/posterX300.jpg" | "N/A"`
         */
        Poster: z.union([z.string().nonempty().url(), z.literal("N/A")]),
      })
      .strict()
      .array(),

    /**
     * Total results available
     *
     * Ex: "100"
     */
    totalResults: z.string().nonempty(),

    /**
     * Success response status
     */
    Response: z.literal("True"),
  })
  .strict();

interface MoviesSearch extends z.infer<typeof MoviesSearchSchema> {}

export { MoviesSearch, MoviesSearchSchema };

/**
 * @author Abhijit Baldawa
 */

import { z } from "zod";

const MovieDetailsSchema = z
  .object({
    /**
     * Unique movie ID
     *
     * Ex: "tt5024912"
     */
    imdbID: z.string().nonempty(),

    /**
     * Movie title
     */
    Title: z.string().nonempty(),

    /**
     * Movie release year
     */
    Year: z.string().nonempty(),

    /**
     * Ex: "PG"
     */
    Rated: z.string().nonempty(),

    /**
     * Ex: "05 Apr 1973"
     */
    Released: z.string().nonempty(),

    /**
     * Ex: "95 min"
     */
    Runtime: z.string().nonempty(),

    /**
     * Ex: "Comedy, Crime, Drama"
     */
    Genre: z.string().nonempty(),

    /**
     * Names of directors
     */
    Director: z.string().nonempty(),

    /**
     * Names of writers
     */
    Writer: z.string().nonempty(),

    /**
     * Names of actors
     *
     * Ex: "actor1, actor2..."
     */
    Actors: z.string().nonempty(),

    /**
     * Plot of the movie
     */
    Plot: z.string().nonempty(),

    /**
     * Languages the movie is available in
     *
     * Ex: "German, Italian, English"
     */
    Language: z.string().nonempty(),

    /**
     * Country of origin
     *
     * Ex: "United Kingdom"
     */
    Country: z.string().nonempty(),

    /**
     * Ex: "N/A"
     */
    Awards: z.string().nonempty(),

    /**
     * Poster URL of the movie
     *
     * Ex: `"https://image/url/posterX300.jpg" | "N/A"`
     */
    Poster: z.union([z.string().nonempty().url(), z.literal("N/A")]),

    /**
     * Movie ratings from different sources
     */
    Ratings: z
      .object({
        /**
         * Ex: "Internet Movie Database"
         */
        Source: z.string().nonempty(),

        /**
         * Ex: "8.1/10"
         */
        Value: z.string().nonempty(),
      })
      .strict()
      .array(),

    /**
     * Ex: "N/A"
     */
    Metascore: z.string().nonempty(),

    /**
     * Ex: "8.1"
     */
    imdbRating: z.string().nonempty(),

    /**
     * Ex: "20,260"
     */
    imdbVotes: z.string().nonempty(),

    /**
     * Type of record
     *
     * Ex: "movie"
     */
    Type: z.literal("movie"),

    /**
     * Ex: "N/A"
     */
    DVD: z.string().nonempty(),

    /**
     * Ex: "N/A"
     */
    BoxOffice: z.string().nonempty(),

    /**
     * Ex: "N/A"
     */
    Production: z.string().nonempty(),

    /**
     * Ex: "N/A"
     */
    Website: z.string().nonempty(),

    /**
     * Success response status
     */
    Response: z.literal("True"),
  })
  .strict();

interface MovieDetails extends z.infer<typeof MovieDetailsSchema> {}

export { MovieDetails, MovieDetailsSchema };

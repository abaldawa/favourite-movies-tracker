/**
 * @author Abhijit Baldawa
 */

import { z } from "zod";

const FavoriteMovieDbRecordSchema = z.object({
  /**
   * Unique movie ID
   *
   * Ex: "tt5024912"
   */
  imdbID: z.string().nonempty(),

  /**
   * Movie title
   */
  title: z.string().nonempty(),

  /**
   * Movie release year
   */
  releaseYear: z.string().nonempty(),

  /**
   * Poster URL of the movie
   *
   * Ex: `"https://image/url/posterX300.jpg" | "N/A"`
   */
  posterUrl: z.union([z.string().nonempty().url(), z.literal("N/A")]),

  /**
   * Upvotes the movie has from all the users
   */
  upvotes: z.number().int().nonnegative(),
});

interface FavoriteMovieDbRecord
  extends z.infer<typeof FavoriteMovieDbRecordSchema> {}

export { FavoriteMovieDbRecordSchema, FavoriteMovieDbRecord };

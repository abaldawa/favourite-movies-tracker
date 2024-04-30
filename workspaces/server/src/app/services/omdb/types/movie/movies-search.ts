/**
 * @author Abhijit Baldawa
 */

import { server as commonServer } from "@favorite-movies-tracker/common";

const MoviesSearchSchema =
  commonServer.modules.movies.restApi.types.moviesSearch.MoviesSearchSchema;

type MoviesSearch =
  commonServer.modules.movies.restApi.types.moviesSearch.MoviesSearch;

export { MoviesSearch, MoviesSearchSchema };

/**
 * @author Abhijit Baldawa
 */

import * as omdbService from "../../services/omdb/service";
import * as favoriteMovieDbModel from "../../database/models/favorite-movie";

const searchMoviesByTitle = (
  ...args: Parameters<typeof omdbService.searchMoviesByTitle>
) => omdbService.searchMoviesByTitle(...args);

const createOrUpvoteFavoriteMovie = async (imdbId: string) => {
  const foundAndUpvotedMovie = favoriteMovieDbModel.findAndUpvote(imdbId);

  if (foundAndUpvotedMovie) {
    return foundAndUpvotedMovie;
  }

  const movie = await omdbService.getMovieByImdbId(imdbId);

  return favoriteMovieDbModel.insert({
    imdbID: movie.imdbID,
    title: movie.Title,
    releaseYear: movie.Year,
    posterUrl: movie.Poster,
    upvotes: 0,
  });
};

const upvoteFavoriteMovie = (imdbId: string) =>
  favoriteMovieDbModel.findAndUpvote(imdbId);

const getAllFavoriteMovies = (
  ...args: Parameters<typeof favoriteMovieDbModel.getAll>
) => favoriteMovieDbModel.getAll(...args);

export {
  searchMoviesByTitle,
  createOrUpvoteFavoriteMovie,
  upvoteFavoriteMovie,
  getAllFavoriteMovies,
};

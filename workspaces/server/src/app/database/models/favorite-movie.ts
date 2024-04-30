/**
 * @author Abhijit Baldawa
 */

import { server as commonServer } from "@favorite-movies-tracker/common";

import favoriteMovieModel = commonServer.models.favoriteMovie;

/**
 * Using in-memory DB just for demonstration
 */
const favoriteMoviesDb: favoriteMovieModel.FavoriteMovieDbRecord[] = [];

const findAndUpvote = (imdbId: string) => {
  const foundMovie = favoriteMoviesDb.find(
    (favoriteMovie) => favoriteMovie.imdbID === imdbId
  );

  if (!foundMovie) {
    return;
  }

  foundMovie.upvotes++;

  return foundMovie;
};

const insert = (favoriteMovie: favoriteMovieModel.FavoriteMovieDbRecord) => {
  favoriteMoviesDb.push(favoriteMovie);

  return favoriteMovie;
};

const getAll = (upvotesSortOrder?: "ASC" | "DES") => {
  if (!upvotesSortOrder) {
    return favoriteMoviesDb;
  }

  return [...favoriteMoviesDb].sort((movie1, movie2) => {
    if (upvotesSortOrder === "DES") {
      return movie2.upvotes - movie1.upvotes;
    }

    return movie1.upvotes - movie2.upvotes;
  });
};

export { insert, findAndUpvote, getAll };

/**
 * @author Abhijit Baldawa
 *
 * Central store to manage movies
 */

import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { immer } from "zustand/middleware/immer";
import {
  entertainmentServiceModels,
  entertainmentServiceModules,
} from "../../shared/backend-services/entertainment-service";
import { CanceledError } from "axios";

import moviesRestApi = entertainmentServiceModules.movies.restApi;

interface MovieStore {
  getAllFavoriteMovies: {
    loading: boolean;
    error?: unknown;
    value?: entertainmentServiceModels.favoriteMovie.FavoriteMovieDbRecord[];

    callApi: (
      ...args: Parameters<typeof moviesRestApi.query.getAllFavoriteMovies>
    ) => Promise<void>;
  };

  upvoteFavoriteMovie: {
    loading: boolean;
    error?: unknown;
    value?: entertainmentServiceModels.favoriteMovie.FavoriteMovieDbRecord;

    callApi: (
      ...args: Parameters<typeof moviesRestApi.query.upvoteFavoriteMovie>
    ) => Promise<void>;
  };

  searchMovies: {
    loading: boolean;
    error?: unknown;
    value?: {
      errorResponse?: moviesRestApi.SearchMoviesApi.ErrorResponse["Error"];
      movies?: moviesRestApi.types.moviesSearch.MoviesSearch["Search"];
      hasNextPage: boolean;
    };

    callApi: (
      maxTotalMoviesToDisplay: number,
      ...args: Parameters<typeof moviesRestApi.query.searchMovies>
    ) => Promise<void>;

    reset: () => void;
  };

  createOrUpvoteFavoriteMovie: {
    loading: boolean;
    error?: unknown;
    value?: entertainmentServiceModels.favoriteMovie.FavoriteMovieDbRecord;

    callApi: (
      ...args: Parameters<
        typeof moviesRestApi.query.createOrUpvoteFavoriteMovie
      >
    ) => Promise<void>;
  };
}

const MAX_TOTAL_MOVIES_SEARCHED_PER_PAGE = 10;

const useMovieStore = createWithEqualityFn<MovieStore>()(
  immer((set, get) => ({
    getAllFavoriteMovies: {
      loading: false,

      callApi: async (...args) => {
        try {
          set((state) => void (state.getAllFavoriteMovies.loading = true));

          const favoriteMovies = await moviesRestApi.query.getAllFavoriteMovies(
            ...args
          );

          set(
            (state) => void (state.getAllFavoriteMovies.value = favoriteMovies)
          );
        } catch (error) {
          set((state) => void (state.getAllFavoriteMovies.error = error));
        } finally {
          set((state) => void (state.getAllFavoriteMovies.loading = false));
        }
      },
    },

    upvoteFavoriteMovie: {
      loading: false,

      callApi: async (...args) => {
        try {
          set((state) => void (state.upvoteFavoriteMovie.loading = true));

          const upvotedFavoriteMovie =
            await moviesRestApi.query.upvoteFavoriteMovie(...args);

          set(
            (state) =>
              void (state.upvoteFavoriteMovie.value = upvotedFavoriteMovie)
          );

          get().getAllFavoriteMovies.callApi({ sortByUpvotes: "DES" });
        } catch (error) {
          set((state) => void (state.upvoteFavoriteMovie.error = error));
        } finally {
          set((state) => void (state.upvoteFavoriteMovie.loading = false));
        }
      },
    },

    searchMovies: {
      loading: false,

      callApi: async (
        maxTotalMoviesToDisplay,
        queryParams,
        abortSignal,
        baseUrl
      ) => {
        // if no search provided then clear the entire search state
        if (!queryParams.title) {
          get().searchMovies.reset();
          return;
        }

        try {
          // 1. Adjust the state values before the query
          set((state) => {
            // start the loading and clear any previous error
            state.searchMovies.loading = true;
            state.searchMovies.error = undefined;

            // Check if there are any previous search results
            if (state.searchMovies.value) {
              // clear any previous search error response and pagination details
              state.searchMovies.value.errorResponse = undefined;
              state.searchMovies.value.hasNextPage = false;

              if (queryParams.page === 1) {
                // for new title search clear any previously  searched movies
                state.searchMovies.value.movies = undefined;
              }
            }
          });

          // 2. Search movies based on provided search settings
          const searchResult = await moviesRestApi.query.searchMovies(
            queryParams,
            abortSignal,
            baseUrl
          );

          // 3. Set the state based on search response received
          set((state) => {
            // Track any previously searched movies
            const previousMovies = state.searchMovies.value?.movies;

            // Start building searched movie result state
            state.searchMovies.value = {
              hasNextPage: false,
            };

            if (searchResult.Response === "True") {
              // Set the total movies array as specified by maxTotalMoviesToDisplay
              state.searchMovies.value.movies = [
                ...(previousMovies ?? []),
                ...searchResult.Search,
              ].slice(-maxTotalMoviesToDisplay);

              // Check if there are still more results available
              if (
                queryParams.page * MAX_TOTAL_MOVIES_SEARCHED_PER_PAGE <
                Number(searchResult.totalResults)
              ) {
                state.searchMovies.value.hasNextPage = true;
              }
            } else {
              // set the state accordingly for error response received
              state.searchMovies.value.errorResponse = searchResult.Error;
            }
          });
        } catch (error) {
          if (!(error instanceof CanceledError)) {
            // Set the error only if its not cancelled
            set((state) => void (state.searchMovies.error = error));
          }
        } finally {
          set((state) => void (state.searchMovies.loading = false));
        }
      },

      reset: () => {
        set((state) => {
          state.searchMovies.loading = false;
          state.searchMovies.value = undefined;
          state.searchMovies.error = undefined;
        });
      },
    },

    createOrUpvoteFavoriteMovie: {
      loading: false,

      callApi: async (...args) => {
        try {
          set(
            (state) => void (state.createOrUpvoteFavoriteMovie.loading = true)
          );

          const createdOrUpvotedMovie =
            await moviesRestApi.query.createOrUpvoteFavoriteMovie(...args);

          set(
            (state) =>
              void (state.createOrUpvoteFavoriteMovie.value =
                createdOrUpvotedMovie)
          );

          get().getAllFavoriteMovies.callApi({ sortByUpvotes: "DES" });
        } catch (error) {
          set(
            (state) => void (state.createOrUpvoteFavoriteMovie.error = error)
          );
        } finally {
          set(
            (state) => void (state.createOrUpvoteFavoriteMovie.loading = false)
          );
        }
      },
    },
  })),
  shallow
);

export { useMovieStore, MovieStore };

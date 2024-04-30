/**
 * @author Abhijit Baldawa
 */

import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { SearchBox } from "../../../../shared/components/app-components/search-box/search-box";
import { useMovieStore } from "../../../../store/movie/store";
import { SearchedMoviesList } from "../../components/searched-movies-list/searched-movies-list";
import { MovieItem } from "../../components/movie-item/movie-item";
import { Loading } from "../../../../shared/components/ui/loading/loading";
import { usePopupStore } from "../../../../store/popup/store";
import * as S from "./favorite-movie.styles";

/**
 * Maximum search results to display in an
 * infinite scrolling search.
 *
 * Ex. If a user search results in 700 items
 * and the search API is returning 10 items
 * per page, then, as the user keeps scrolling,
 * keep accumulating the results from previous
 * search until the results of 5th page. Beyond
 * that keep going with the infinite scroll and
 * and fetch but display only the last 50 searched
 * items. This way the browser tab will not go
 * out of memory/slow down in an infinitely scroll
 * situation.
 */
const MAX_SEARCH_RESULTS_TO_DISPLAY = 50;

const FavoriteMovies: React.FC = () => {
  const [searchSetting, setSearchSetting] = useState<{
    movieTitleToSearch: string;
    page: number;
  }>();

  const { showPopup } = usePopupStore((state) => ({
    showPopup: state.showPopup,
  }));

  const {
    getAllFavoriteMovies,
    searchMovies,
    createOrUpvoteFavoriteMovie,
    upvoteFavoriteMovie,
  } = useMovieStore((state) => ({
    searchMovies: state.searchMovies,
    getAllFavoriteMovies: state.getAllFavoriteMovies,
    createOrUpvoteFavoriteMovie: state.createOrUpvoteFavoriteMovie,
    upvoteFavoriteMovie: state.upvoteFavoriteMovie,
  }));

  const fetchNextPageSearchResults = () => {
    if (!searchMovies.loading && searchSetting) {
      setSearchSetting({
        ...searchSetting,
        page: searchSetting.page + 1,
      });
    }
  };

  /**
   * Fetch all favorite movies on mount
   */
  useEffect(() => {
    getAllFavoriteMovies.callApi({ sortByUpvotes: "DES" });
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    if (searchSetting) {
      searchMovies.callApi(
        MAX_SEARCH_RESULTS_TO_DISPLAY, // Max searched movies to display
        { title: searchSetting.movieTitleToSearch, page: searchSetting.page },
        controller.signal
      );
    }

    return () => controller.abort();
  }, [searchSetting]);

  useEffect(() => {
    if (searchMovies.error) {
      showPopup({
        type: "api-error",
        title: "Error searching movie",
        dismissible: true,
        error: searchMovies.error,
        buttons: {
          confirm: {
            label: "OK",
          },
        },
      });
    }
  }, [searchMovies.error]);

  useEffect(() => {
    if (getAllFavoriteMovies.error) {
      showPopup({
        type: "api-error",
        title: "Error fetching favorite movies",
        dismissible: true,
        error: getAllFavoriteMovies.error,
        buttons: {
          confirm: {
            label: "OK",
          },
        },
      });
    }
  }, [getAllFavoriteMovies.error]);

  useEffect(() => {
    if (createOrUpvoteFavoriteMovie.error) {
      showPopup({
        type: "api-error",
        title: "Error adding/upvoting movie to favorite list",
        dismissible: true,
        error: createOrUpvoteFavoriteMovie.error,
        buttons: {
          confirm: {
            label: "OK",
          },
        },
      });
    }
  }, [createOrUpvoteFavoriteMovie.error]);

  useEffect(() => {
    if (upvoteFavoriteMovie.error) {
      showPopup({
        type: "api-error",
        title: "Error upvoting movie",
        dismissible: true,
        error: upvoteFavoriteMovie.error,
        buttons: {
          confirm: {
            label: "OK",
          },
        },
      });
    }
  }, [upvoteFavoriteMovie.error]);

  return (
    <>
      {(getAllFavoriteMovies.loading ||
        createOrUpvoteFavoriteMovie.loading ||
        upvoteFavoriteMovie.loading) && <Loading />}

      <S.Container>
        <Typography variant="h1">Favorite movies tracker</Typography>
        <SearchBox
          startAdornment={<S.SearchIconWrapper>🔎</S.SearchIconWrapper>}
          value={searchSetting?.movieTitleToSearch ?? ""}
          placeholder="Add your favorite movie"
          onChange={(event) =>
            setSearchSetting({
              movieTitleToSearch: event.target.value,
              page: 1,
            })
          }
          renderSearchResults={() =>
            Boolean(searchSetting?.movieTitleToSearch.length) && (
              <SearchedMoviesList
                loading={searchMovies.loading}
                searchResult={searchMovies.value}
                fetchNextPageSearchResults={fetchNextPageSearchResults}
                onMovieClicked={(imdbId) =>
                  createOrUpvoteFavoriteMovie.callApi({ imdbId })
                }
              />
            )
          }
        />
        <S.FavoriteMoviesListWrapper>
          {getAllFavoriteMovies.value?.map((favoriteMovie) => (
            <MovieItem
              key={favoriteMovie.imdbID}
              showHoverEffect
              posterUrl={favoriteMovie.posterUrl}
              releaseYear={favoriteMovie.releaseYear}
              title={favoriteMovie.title}
              onClick={() =>
                upvoteFavoriteMovie.callApi({ imdbId: favoriteMovie.imdbID })
              }
              renderMovieActionItem={() => (
                <S.LikeButton disableElevation>
                  <Typography variant="h2" fontSize="0.75rem">
                    &#x2665;
                  </Typography>
                  <Typography variant="h2">{favoriteMovie.upvotes}</Typography>
                </S.LikeButton>
              )}
            />
          ))}
        </S.FavoriteMoviesListWrapper>
      </S.Container>
    </>
  );
};

export { FavoriteMovies };

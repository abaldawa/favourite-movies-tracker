/**
 * @author Abhijit Baldawa
 */

import React, { useEffect, useRef, useState } from "react";
import { MovieItem } from "../movie-item/movie-item";
import { CircularProgress, Typography } from "@mui/material";
import { useIsElementVisible } from "@favorite-movies-tracker/client/src/app/shared/hooks/use-is-element-visible";
import type { MovieStore } from "@favorite-movies-tracker/client/src/app/store/movie/store";
import * as S from "./searched-movies-list.styles";

interface SearchedMoviesListProps {
  loading: boolean;
  searchResult: MovieStore["searchMovies"]["value"];
  onMovieClicked: (imdbId: string) => void;
  fetchNextPageSearchResults: () => void;
}

const SearchedMoviesList: React.FC<SearchedMoviesListProps> = (props) => {
  const { loading, searchResult, onMovieClicked, fetchNextPageSearchResults } =
    props;
  const [hoveredMovieImdbDb, setHoveredMovieImdbDb] = useState<string>();

  const scrollToEndObserveTarget = useRef<HTMLDivElement>(null);
  const userScrolledToEnd = useIsElementVisible(
    scrollToEndObserveTarget,
    Boolean(searchResult?.hasNextPage)
  );

  useEffect(() => {
    if (userScrolledToEnd) {
      fetchNextPageSearchResults();
    }
  }, [userScrolledToEnd]);

  return (
    <S.Container>
      {searchResult?.movies?.map((movie) => (
        <MovieItem
          key={movie.imdbID}
          showHoverEffect
          posterUrl={movie.Poster}
          releaseYear={movie.Year}
          title={movie.Title}
          sx={{ padding: "0.75rem" }}
          isHovered={(hovered) =>
            setHoveredMovieImdbDb(hovered ? movie.imdbID : undefined)
          }
          onClick={() => onMovieClicked(movie.imdbID)}
          renderMovieActionItem={() =>
            movie.imdbID === hoveredMovieImdbDb && (
              <S.AddToListButton disableElevation>
                <Typography variant="h2">Add to list</Typography>
              </S.AddToListButton>
            )
          }
        />
      ))}

      {!!searchResult?.errorResponse && searchResult.errorResponse}

      <div ref={scrollToEndObserveTarget} />

      {loading && (
        <CircularProgress
          size={20}
          color="inherit"
          style={{ alignSelf: "center" }}
        />
      )}
    </S.Container>
  );
};

export { SearchedMoviesList };

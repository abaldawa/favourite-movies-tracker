/**
 * @author Abhijit Baldawa
 */

import React, { ComponentProps } from "react";
import { entertainmentServiceModels } from "../../../../shared/backend-services/entertainment-service";
import * as S from "./movie-item.styles";

type SearchedMovie = Pick<
  entertainmentServiceModels.favoriteMovie.FavoriteMovieDbRecord,
  "title" | "releaseYear" | "posterUrl"
>;

interface MovieItemProps extends SearchedMovie {
  showHoverEffect?: boolean;
  isHovered?: (isHovered: boolean) => void;
  onClick?: () => void | Promise<void>;
  renderMovieActionItem?: () => React.ReactNode;
  sx?: ComponentProps<typeof S.Container>["sx"];
}

const MovieItem: React.FC<MovieItemProps> = (props) => {
  const {
    title,
    releaseYear,
    posterUrl,
    isHovered,
    onClick,
    showHoverEffect,
    renderMovieActionItem,
    sx,
  } = props;

  return (
    <S.Container
      showHoverEffect={showHoverEffect}
      onMouseEnter={isHovered && (() => isHovered(true))}
      onMouseLeave={isHovered && (() => isHovered(false))}
      onClick={onClick && (() => onClick())}
      sx={sx}
    >
      <S.PosterWrapper>
        {posterUrl === "N/A" ? (
          <S.NoPosterAvailable>N/A</S.NoPosterAvailable>
        ) : (
          <S.Poster alt={title} src={posterUrl} loading="lazy" />
        )}
      </S.PosterWrapper>

      <S.MovieDetailsWrapper>
        <S.Title>{title}</S.Title>
        <S.Year>{releaseYear}</S.Year>
      </S.MovieDetailsWrapper>

      {renderMovieActionItem?.()}
    </S.Container>
  );
};

export { MovieItem, MovieItemProps };

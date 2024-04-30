/**
 * @author Abhijit Baldawa
 */

import { Box, Typography, styled } from "@mui/material";
import type { MovieItemProps } from "./movie-item";

const Container = styled(Box, {
  shouldForwardProp: (prop) => prop !== "showHoverEffect",
})<Pick<MovieItemProps, "showHoverEffect">>(({ showHoverEffect }) => ({
  display: "flex",
  alignItems: "center",
  gap: "1.25rem",
  borderRadius: "0.5rem",
  cursor: `url(/assets/icons/cursor.svg), pointer`,
  ...(showHoverEffect && {
    "&:hover": {
      backgroundColor: "#F5FAFF",
    },
  }),
}));

Container.defaultProps = {
  component: "article",
};

const PosterWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "2rem",
  height: "3rem",
  flexShrink: 0,
});

const NoPosterAvailable = styled(Box)({
  backgroundColor: "#706c6c",
  color: "#fff",
  flexGrow: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "0.6rem",
});

const Poster = styled("img")({
  flexGrow: 1,
  height: "100%",
  objectFit: "cover",
});

const MovieDetailsWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const Title = styled(Typography)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

Title.defaultProps = {
  variant: "h2",
};

const Year = styled(Typography)({});

Year.defaultProps = {
  variant: "subtitle1",
};

export {
  Container,
  PosterWrapper,
  NoPosterAvailable,
  Poster,
  MovieDetailsWrapper,
  Title,
  Year,
};

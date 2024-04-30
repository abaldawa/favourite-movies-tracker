/**
 * @author Abhijit Baldawa
 */

import { Box, Button, styled } from "@mui/material";

const Container = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  width: "100%",
  maxWidth: "28.5rem",
});

Container.defaultProps = {
  component: "section",
};

const SearchIconWrapper = styled(Box)({
  color: "#999",
});

const FavoriteMoviesListWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  overflow: "scroll",
  height: "60vh",
});

FavoriteMoviesListWrapper.defaultProps = {
  component: "article",
};

const LikeButton = styled(Button)({
  padding: "0.5rem 0.75rem",
  borderRadius: "0.5rem",
  display: "flex",
  alignItems: "center",
  gap: "0.6875rem",
  marginLeft: "auto",
  flexShrink: "0",
  cursor: "inherit",
  backgroundColor: "#FC5216",
});

LikeButton.defaultProps = {
  variant: "contained",
  color: "secondary",
};

export { Container, SearchIconWrapper, FavoriteMoviesListWrapper, LikeButton };

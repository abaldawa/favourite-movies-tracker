/**
 * @author Abhijit Baldawa
 *
 * Provides layout for the entire UI
 */

import { Box, styled } from "@mui/material";

const PageContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: theme.palette.primary.main,
  padding: "1rem",
  overflow: "scroll",

  [theme.breakpoints.up("sm")]: {
    justifyContent: "center",
  },
}));

PageContainer.defaultProps = {
  component: "main",
};

export { PageContainer };

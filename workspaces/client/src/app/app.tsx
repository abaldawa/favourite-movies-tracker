/**
 * @author Abhijit Baldawa
 */

import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider } from "@mui/material/styles";
import { PopupHandler } from "./shared/components/app-components/popup/containers/popup-handler/popup-handler";
import { AppThemeProvider } from "./theme";
import { PageContainer } from "./shared/layouts/page-container.styles";
import { FavoriteMovies } from "./modules/movies/containers/favorite-movies/favorite-movie";

const App: React.FC = () => {
  return (
    <StyledEngineProvider injectFirst>
      <AppThemeProvider>
        <CssBaseline />
        <PopupHandler />
        <PageContainer>
          <FavoriteMovies />
        </PageContainer>
      </AppThemeProvider>
    </StyledEngineProvider>
  );
};

export { App };

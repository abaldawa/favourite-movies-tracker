/**
 * @author Abhijit Baldawa
 *
 * Theme provider module
 */

import * as React from "react";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";

let appTheme = createTheme({
  palette: {
    primary: {
      main: "#FFFFFF",
      contrastText: "#05103E",
    },
    secondary: {
      main: "#05103E",
      contrastText: "#FFFFFF",
    },
  },

  typography: {
    fontFamily: "Inter",
    h1: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },

    h2: {
      fontSize: "1rem",
      fontWeight: 700,
    },

    subtitle1: {
      color: "#5E678E",
      fontSize: "0.875rem",
      fontWeight: 400,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Inter';
          src: url(/assets/fonts/Inter/Inter-VariableFont.ttf);
        }
      `,
    },
  },
});

appTheme = responsiveFontSizes(appTheme);

/**
 * @public
 *
 * Component which provides theme to the entire
 * react children tree
 */
const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ThemeProvider theme={appTheme}>{children}</ThemeProvider>;

export { AppThemeProvider };

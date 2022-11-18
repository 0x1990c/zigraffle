import { createTheme } from "@mui/material/styles";
import dark from "./dark";

const darkMui = createTheme({
  palette: {
    ...dark,
    primary: {
      main: dark.highlighted,
    },

    secondary: {
      dark: "#191927",
      main: "#656565",
    },

    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: ["Avenir Next", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
  },
  components: {
    // Name of the component
    MuiButtonBase: {
      defaultProps: {
        // The props to change the default for.
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "rgba(16, 18, 37)",
          color: dark.neutral200,
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: "h2",
          h2: "h2",
          h3: "h2",
          h4: "h2",
          h5: "h2",
          h6: "h2",
          subtitle1: "h2",
          subtitle2: "h2",
          body1: "span",
          body2: "span",
        },
      },
      styleOverrides: {
        root: {
          letterSpacing: "0.55px",
        },
        h1: {
          fontSize: "22px",
          lineHeight: "36px",
        },
        h2: {
          fontSize: "18px",
          lineHeight: "28px",
        },
        h3: {
          fontSize: "15px",
          lineHeight: "24px",
        },
        h4: {
          fontSize: "13px",
          lineHeight: "20px",
        },
        h5: {
          fontSize: "11px",
          lineHeight: "16px",
        },
        body1: {
          fontSize: "15px",
          lineHeight: "24px",
        },
        body2: {
          fontSize: "13px",
          lineHeight: "20px",
        },
      },
    },
  },
});

export default darkMui;
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Raleway', sans-serif",
    fontSize: 12,
  },
  palette: {
    primary: {
      main: "#b42733",
    },
    secondary: {
      main: "#096baa",
    },
  },
});

export default function ThemeContext({ children }) {
  return <ThemeProvider theme={theme} children={children} />;
}

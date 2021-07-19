import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Raleway', sans-serif",
    fontSize: 12,
  },
  palette: {
    primary: {
      main: "#2589BD",
    },
    secondary: {
      main: "#A3B4A2",
    },
  },
});

export default function ThemeContext({ children }) {
  return <ThemeProvider theme={theme} children={children} />;
}

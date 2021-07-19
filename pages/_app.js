import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "../comps/apollo/client";
import UserProvider from "../comps/auth/UserProvider";
import { StylesProvider } from "@material-ui/styles";
import ThemeContext from "../comps/theme/ThemeContext";
import TopAppBar from "../comps/nav/TopAppBar";

function MyApp({ Component, pageProps }) {
  return (
    <StylesProvider injectFirst>
      <ThemeContext>
        <ApolloProvider client={client}>
          <UserProvider>
            <TopAppBar />
            <Component {...pageProps} />
          </UserProvider>
        </ApolloProvider>
      </ThemeContext>
    </StylesProvider>
  );
}

export default MyApp;

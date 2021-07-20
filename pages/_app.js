import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "../comps/apollo/client";
import UserProvider from "../comps/auth/UserProvider";
import { StylesProvider } from "@material-ui/styles";
import ThemeContext from "../comps/theme/ThemeContext";
import Navigation from "../comps/nav/Navigation";

function MyApp({ Component, pageProps }) {
  return (
    <StylesProvider injectFirst>
      <ThemeContext>
        <ApolloProvider client={client}>
          <UserProvider>
            <Navigation />
            <Component {...pageProps} />
          </UserProvider>
        </ApolloProvider>
      </ThemeContext>
    </StylesProvider>
  );
}

export default MyApp;

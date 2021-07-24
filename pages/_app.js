import { ApolloProvider } from "@apollo/client";
import { StylesProvider } from "@material-ui/styles";
import client from "../comps/apollo/client";
import UserProvider from "../comps/auth/UserProvider";
import Navigation from "../comps/nav/Navigation";
import ThemeContext from "../comps/theme/ThemeContext";
import Footer from "../comps/ui/Footer";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <StylesProvider injectFirst>
      <ThemeContext>
        <ApolloProvider client={client}>
          <UserProvider>
            <Navigation />
            <Component {...pageProps} />
            <Footer />
          </UserProvider>
        </ApolloProvider>
      </ThemeContext>
    </StylesProvider>
  );
}

export default MyApp;

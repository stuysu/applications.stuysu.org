import { ApolloProvider } from "@apollo/client";
import { StylesProvider } from "@material-ui/styles";
import { SnackbarProvider } from "notistack";
import client from "../comps/apollo/client";
import UserProvider from "../comps/auth/UserProvider";
import SharedDialog from "../comps/dialog/SharedDialog";
import Navigation from "../comps/nav/Navigation";
import ThemeContext from "../comps/theme/ThemeContext";
import Footer from "../comps/ui/Footer";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <StylesProvider injectFirst>
      <ThemeContext>
        <SnackbarProvider
          classes={{
            variantSuccess: "successSnackbar",
          }}
        >
          <SharedDialog />
          <ApolloProvider client={client}>
            <UserProvider>
              <Navigation />
              <Component {...pageProps} />
              <Footer />
            </UserProvider>
          </ApolloProvider>
        </SnackbarProvider>
      </ThemeContext>
    </StylesProvider>
  );
}

export default MyApp;

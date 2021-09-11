import { ApolloProvider } from "@apollo/client";
import { StylesProvider } from "@material-ui/styles";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";
import { useEffect } from "react";
import ReactGA from "react-ga";
import AdminWrapper from "../comps/admin/AdminWrapper";
import client from "../comps/apollo/client";
import UserProvider from "../comps/auth/UserProvider";
import DateProvider from "../comps/date/DateProvider";
import SharedDialog from "../comps/dialog/SharedDialog";
import Navigation from "../comps/nav/Navigation";
import ThemeContext from "../comps/theme/ThemeContext";
import Footer from "../comps/ui/Footer";
import { GOOGLE_ANALYTICS_ID } from "../constants";
import "../styles/globals.css";

ReactGA.initialize(GOOGLE_ANALYTICS_ID);

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { noNavigation, noFooter } = router.query;

  useEffect(() => {
    if (globalThis.window) {
      const url = new globalThis.URL(window.location.href);
      url.searchParams.delete("jwt");

      ReactGA.pageview(url.pathname + url.search);
    }
  }, [router]);

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
              <DateProvider>
                <AdminWrapper>
                  {noNavigation !== "true" && <Navigation />}
                  <Component {...pageProps} />
                  {noFooter !== "true" && <Footer />}
                </AdminWrapper>
              </DateProvider>
            </UserProvider>
          </ApolloProvider>
        </SnackbarProvider>
      </ThemeContext>
    </StylesProvider>
  );
}

export default MyApp;

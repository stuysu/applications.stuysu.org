import { ApolloProvider } from "@apollo/client";
import { StylesProvider } from "@material-ui/styles";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";
import AdminWrapper from "../comps/admin/AdminWrapper";
import client from "../comps/apollo/client";
import UserProvider from "../comps/auth/UserProvider";
import DateProvider from "../comps/date/DateProvider";
import SharedDialog from "../comps/dialog/SharedDialog";
import Navigation from "../comps/nav/Navigation";
import ThemeContext from "../comps/theme/ThemeContext";
import Footer from "../comps/ui/Footer";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { noNavigation, noFooter } = router.query;

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

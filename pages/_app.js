import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "../comps/apollo/client";
import UserProvider from "../comps/auth/UserProvider";

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ApolloProvider>
  );
}

export default MyApp;

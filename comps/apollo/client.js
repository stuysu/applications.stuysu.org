import { ApolloClient, InMemoryCache } from "@apollo/client";

export const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: "/api/graphql",
  credentials: "include",
  headers: {
    authorization: localStorage.getItem("jwt"),
  },
  cache,
});

export default client;

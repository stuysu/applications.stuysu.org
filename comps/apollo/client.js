import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

export const cache = new InMemoryCache();

const authJWT = globalThis.localStorage?.getItem("jwt");
const link = createUploadLink({
  uri: "/api/graphql",
  credentials: "include",
  headers: {
    authorization: authJWT ? "Bearer " + authJWT : "",
  },
});

const client = new ApolloClient({
  link,
  cache,
});

export default client;

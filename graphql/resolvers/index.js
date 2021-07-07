import { resolvers as graphqlScalarResolvers } from "graphql-scalars";
import Mutation from "./Mutation";
import Query from "./Query";

const resolvers = {
  ...graphqlScalarResolvers,
  Mutation,
  Query,
};

export default resolvers;

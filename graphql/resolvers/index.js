import { resolvers as graphqlScalarResolvers } from "graphql-scalars";
import Mutation from "./Mutation";
import Query from "./Query";
import User from "./User";

const resolvers = {
  ...graphqlScalarResolvers,
  Mutation,
  Query,
  User,
};

export default resolvers;

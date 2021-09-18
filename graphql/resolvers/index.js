import { resolvers as graphqlScalarResolvers } from "graphql-scalars";
import AnonymityID from "./AnonymityID";
import Mutation from "./Mutation";
import Query from "./Query";
import User from "./User";

const resolvers = {
  ...graphqlScalarResolvers,
  AnonymityID,
  Mutation,
  Query,
  User,
};

export default resolvers;

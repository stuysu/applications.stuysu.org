import { resolvers as graphqlScalarResolvers } from "graphql-scalars";
import AnonymityID from "./AnonymityID";
import Application from "./Application";
import Mutation from "./Mutation";
import Query from "./Query";
import User from "./User";

const resolvers = {
  ...graphqlScalarResolvers,
  AnonymityID,
  Application,
  Mutation,
  Query,
  User,
};

export default resolvers;

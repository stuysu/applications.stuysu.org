import { typeDefs as graphqlScalarDefs } from "graphql-scalars";
import Application from "./Application";
import Mutation from "./Mutation";
import PaginatedApplicationResult from "./PaginatedApplicationResult";
import PaginatedUserResult from "./PaginatedUserResult";
import Query from "./Query";
import User from "./User";

const typeDefs = [
  ...graphqlScalarDefs,
  Application,
  Mutation,
  PaginatedApplicationResult,
  PaginatedUserResult,
  Query,
  User,
];

export default typeDefs;

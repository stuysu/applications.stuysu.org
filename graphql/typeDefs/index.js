import { typeDefs as graphqlScalarDefs } from "graphql-scalars";
import AnonymityType from "./AnonymityType";
import Application from "./Application";
import FAQ from "./FAQ";
import Mutation from "./Mutation";
import PaginatedApplicationResult from "./PaginatedApplicationResult";
import PaginatedFAQResult from "./PaginatedFAQResult";
import PaginatedUserResult from "./PaginatedUserResult";
import Query from "./Query";
import User from "./User";

const typeDefs = [
  ...graphqlScalarDefs,
  AnonymityType,
  Application,
  FAQ,
  Mutation,
  PaginatedApplicationResult,
  PaginatedFAQResult,
  PaginatedUserResult,
  Query,
  User,
];

export default typeDefs;

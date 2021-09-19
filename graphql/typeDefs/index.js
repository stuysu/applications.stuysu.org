import { typeDefs as graphqlScalarDefs } from "graphql-scalars";
import AnonymityID from "./AnonymityID";
import AnonymityType from "./AnonymityType";
import Applicant from "./Applicant";
import Application from "./Application";
import ApplicationResult from "./ApplicationResult";
import FAQ from "./FAQ";
import Mutation from "./Mutation";
import PaginatedApplicationResult from "./PaginatedApplicationResult";
import PaginatedFAQResult from "./PaginatedFAQResult";
import PaginatedUserResult from "./PaginatedUserResult";
import Query from "./Query";
import User from "./User";

const typeDefs = [
  ...graphqlScalarDefs,
  AnonymityID,
  AnonymityType,
  Application,
  Applicant,
  ApplicationResult,
  FAQ,
  Mutation,
  PaginatedApplicationResult,
  PaginatedFAQResult,
  PaginatedUserResult,
  Query,
  User,
];

export default typeDefs;

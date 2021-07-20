import { typeDefs as graphqlScalarDefs } from "graphql-scalars";
import Mutation from "./Mutation";
import Query from "./Query";
import User from "./User";

const typeDefs = [...graphqlScalarDefs, User, Query, Mutation];

export default typeDefs;

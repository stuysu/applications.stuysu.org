import { typeDefs as graphqlScalarDefs } from "graphql-scalars";

import Query from "./Query";
import User from "./User";
import Mutation from "./Mutation";

const typeDefs = [...graphqlScalarDefs, User, Query, Mutation];

export default typeDefs;

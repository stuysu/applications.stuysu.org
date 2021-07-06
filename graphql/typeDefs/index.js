import { typeDefs as graphqlScalarDefs } from "graphql-scalars";

import Query from "./Query";
import User from "./User";

const typeDefs = [...graphqlScalarDefs, User, Query];

export default typeDefs;

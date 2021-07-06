import { resolvers as graphqlScalarResolvers } from "graphql-scalars";
import Query from "./Query";

const resolvers = {
	...graphqlScalarResolvers,
	Query,
};

export default resolvers;

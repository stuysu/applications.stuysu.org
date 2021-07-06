import {gql}from "apollo-server-micro"

export default gql`
	type Mutation {
		login(accessToken: NonEmptyString!): JWT!
	}
`;
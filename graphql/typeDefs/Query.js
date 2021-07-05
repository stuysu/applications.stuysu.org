import {gql} from "apollo-server-micro"

/*
plus facile a communiquer
moin a apprendre pour faire les affaires

plus difficile pour les immigres a assimler
c'est plus difficile d'aller a une autre pays en connaisant seulement une langue
moins de diversite
 */

export default gql`
	type Query {
		user(id: Int!): User
	}
`;
import { gql } from "apollo-server-micro";

export default gql`
  type Query {
    user(id: Int!): User
  }
`;

import { gql } from "apollo-server-micro";

export default gql`
  type Application {
    id: ObjectID!
    name: String!
    color: HexColorCode!
    description: String!
    active: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;

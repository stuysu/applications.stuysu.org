import { gql } from "apollo-server-micro";

export default gql`
  type Application {
    id: ObjectID!
    title: NonEmptyString!
    url: NonEmptyString!
    link: String!
    embed: Boolean!
    type: AnonymityType!
    color: HexColorCode!
    more: String!
    active: Boolean!
    archived: Boolean!

    deadline: DateTime!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;

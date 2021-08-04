import { gql } from "apollo-server-micro";

export default gql`
  type FAQ {
    id: ObjectID!
    title: NonEmptyString!
    url: NonEmptyString!
    body: NonEmptyString!
    updatedAt: DateTime!
    createdAt: DateTime!
  }
`;

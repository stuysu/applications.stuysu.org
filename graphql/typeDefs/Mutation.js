import { gql } from "apollo-server-micro";

export default gql`
  type Mutation {
    login(accessToken: NonEmptyString!, idToken: JWT!): JWT!
    logout: Void
    editUser(id: ObjectID!, adminPrivileges: Boolean!): User!
    createFAQ(
      title: NonEmptyString!
      url: NonEmptyString!
      body: NonEmptyString!
    ): FAQ!

    editFAQ(
      id: ObjectID!
      title: NonEmptyString!
      url: NonEmptyString!
      body: NonEmptyString!
    ): FAQ!

    deleteFAQ(id: ObjectID!): Void
  }
`;

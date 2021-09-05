import { gql } from "apollo-server-micro";

export default gql`
  type Mutation {
    login(idToken: JWT!): JWT!
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

    createApplication(
      title: NonEmptyString!
      url: NonEmptyString!
      link: String!
      embed: Boolean!
      type: AnonymityType!
      deadline: DateTime!
      color: HexColorCode!
      more: String!
    ): Application!

    editApplication(
      id: ObjectID!
      title: NonEmptyString!
      url: NonEmptyString!
      link: String!
      embed: Boolean!
      type: AnonymityType!
      deadline: DateTime!
      color: HexColorCode!
      more: String!
      active: Boolean!
      archived: Boolean!
    ): Application!

    recordApplicantEmailByApplicationId(id: ObjectID!): Void

    deleteApplication(id: ObjectID!): Void

    editGoogleDriveAnonymityFileId(fileId: NonEmptyString!): Void
  }
`;

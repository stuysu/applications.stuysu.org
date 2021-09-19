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

    editResultsByApplicationId(
      id: ObjectID!
      acceptedIds: [AnonymityID!]!
      acceptanceMessage: String!
      rejectedIds: [AnonymityID!]!
      rejectionMessage: String!
    ): ApplicationResult!

    """
    Authentication is required and this mutation can only be run once
    This will record the anonymity ID of the current user in the database for an application
    Can only be called when the application is closed
    """
    recordAnonymityIdByApplicationId(
      id: ObjectID!
      anonymityId: AnonymityID!
    ): Applicant!

    recordApplicantEmailByApplicationId(id: ObjectID!): Void

    deleteApplication(id: ObjectID!): Void

    editGoogleDriveAnonymityFileId(fileId: NonEmptyString!): Void
  }
`;

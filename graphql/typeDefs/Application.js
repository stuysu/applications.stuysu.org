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

    """
    Requires adminPrivileges
    """
    results: ApplicationResult!

    applicantEmails: [String!]
    applicants: [Applicant!]!

    """
    Returns the applicant value for the current authenticated user if they've reported their anonymity ID
    Returns null if the user has not reported their id
    """
    authenticatedApplicant: Applicant
  }
`;

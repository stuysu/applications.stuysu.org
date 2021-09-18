import { gql } from "apollo-server-micro";

export default gql`
  type ApplicationResult {
    acceptedIds: [AnonymityID!]!
    acceptanceMessage: String!
    rejectedIds: [AnonymityID!]!
    rejectionMessage: String!
  }
`;

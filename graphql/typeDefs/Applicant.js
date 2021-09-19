import { gql } from "apollo-server-micro";

export default gql`
  enum applicantStatus {
    accepted
    rejected
    unknown
  }

  type Applicant {
    id: ObjectID!
    user: User!
    anonymityId: AnonymityID!
    createdAt: DateTime!

    status: applicantStatus!
    message: String!
  }
`;

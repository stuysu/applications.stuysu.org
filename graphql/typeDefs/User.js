import { gql } from "apollo-server-micro";

export default gql`
  type User {
    id: ObjectID!
    name: String!
    firstName: String!
    lastName: String!
    email: EmailAddress!
    adminPrivileges: Boolean!
    picture: String!
    googleDriveAnonymityFileId: String
  }
`;

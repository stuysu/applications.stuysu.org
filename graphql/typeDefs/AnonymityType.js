import { gql } from "apollo-server-micro";

export default gql`
  enum AnonymityType {
    hybrid
    anonymous
  }
`;

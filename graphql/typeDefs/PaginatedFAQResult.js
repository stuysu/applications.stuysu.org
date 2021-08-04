import { gql } from "apollo-server-micro";

export default gql`
  type PaginatedFAQResult {
    page: NonNegativeInt!
    total: NonNegativeInt!
    numPages: NonNegativeInt!
    resultsPerPage: PositiveInt!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    results: [FAQ!]!
  }
`;

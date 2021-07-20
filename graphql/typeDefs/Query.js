import { gql } from "apollo-server-micro";

export default gql`
  type Query {
    authenticatedUser: User

    """
    Returns all applications that aren't archived
    """
    currentApplications(
      query: String! = ""
      page: PositiveInt! = 1
      resultsPerPage: PositiveInt! = 15
    ): [Application!]!

    """
    Returns a paginated set of all applications with archived set to true
    """
    archivedApplications(
      query: String! = ""
      page: PositiveInt! = 1
      resultsPerPage: PositiveInt! = 15
    ): [Application!]!
  }
`;

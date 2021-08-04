import { gql } from "apollo-server-micro";

export default gql`
  type Query {
    """
    Returns the user that is currently signed in or null if not authenticated
    """
    authenticatedUser: User

    """
    Returns all applications that aren't archived
    Authentication is required
    """
    currentApplications(
      query: String! = ""
      page: PositiveInt! = 1
      resultsPerPage: PositiveInt! = 15
    ): [Application!]!

    """
    Returns a paginated set of all applications with archived set to true
    Authentication is required
    """
    archivedApplications(
      query: String! = ""
      page: PositiveInt! = 1
      resultsPerPage: PositiveInt! = 15
    ): [Application!]!

    """
    Takes an id and returns the associated user.
    Only admins are allowed to access this query
    """
    userById(id: ObjectID!): User

    """
    Takes a query and returns users that match the query.
    Only admins are allowed to access this query
    """
    users(
      query: String! = ""
      page: PositiveInt! = 1
      resultsPerPage: PositiveInt! = 15
    ): PaginatedUserResult!

    """
    Takes a query and returns faqs that contain the query in the title, url, or body
    Open to all, no authentication required
    """
    faqs(
      query: String! = ""
      page: PositiveInt! = 1
      resultsPerPage: PositiveInt! = 10
    ): PaginatedFAQResult!

    """
    Takes and id and returns the matching FAQ or null if no matches are found
    """
    faqById(id: ObjectID!): FAQ

    """
    Takes a url and returns the FAQ associated or null if no faqs have that url
    """
    faqByUrl(url: NonEmptyString!): FAQ
  }
`;

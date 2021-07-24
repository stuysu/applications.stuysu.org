import User from "../../../models/user";

export default (_, { query, page, resultsPerPage }, { adminRequired }) => {
  adminRequired();

  return User.queryUsers({ query, page, resultsPerPage });
};

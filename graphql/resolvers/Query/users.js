import User from "../../../models/user";

export default (_, { query, page, resultsPerPage }, { adminRequired }) => {
  adminRequired();

  const filters = {};
  if (query.includes(":admin")) {
    query = query.replace(":admin", "");
    filters.adminPrivileges = true;
  }

  return User.queryUsers({ query, page, resultsPerPage, filters });
};

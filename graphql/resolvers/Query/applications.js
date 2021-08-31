import Application from "../../../models/application";

export default (
  _,
  { query, page, resultsPerPage },
  { authenticationRequired }
) => {
  authenticationRequired();

  return Application.queryApplications({
    query,
    page,
    resultsPerPage,
  });
};

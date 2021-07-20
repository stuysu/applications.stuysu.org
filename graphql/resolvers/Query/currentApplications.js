import { UserInputError } from "apollo-server-micro";
import Application from "../../../models/application";

export default function (
  _,
  { query, page, resultsPerPage },
  { authenticationRequired }
) {
  authenticationRequired();

  if (resultsPerPage > 50) {
    throw new UserInputError("A maximum of 50 results per page are allowed");
  }

  const filters = { archived: false };

  return Application.queryApplications({
    query,
    page,
    resultsPerPage,
    filters,
  });
}

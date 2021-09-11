import { ApolloError } from "apollo-server-micro";
import axios from "axios";
import RedirectUrl from "../../../models/redirectUrl";

export default async (_, { url }, { adminRequired }) => {
  adminRequired();

  let redirect;
  try {
    redirect = await RedirectUrl.getFinal(url.href);
  } catch (e) {
    throw new ApolloError(
      "There was an error loading the page. The url might not be valid.",
      "PAGE_LOAD_ERROR"
    );
  }

  try {
    const { headers } = await axios.get(redirect.final);
    if (headers["x-frame-options"]?.toLowerCase() === "deny") {
      return false;
    }
  } catch (e) {
    throw new ApolloError(
      "There was an error loading the page. The url might not be valid.",
      "PAGE_LOAD_ERROR"
    );
  }

  return true;
};

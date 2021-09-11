import { ApolloError } from "apollo-server-micro";
import RedirectUrl from "../../../models/redirectUrl";

export default async (_, { url }, { adminRequired }) => {
  adminRequired();

  let redirect;

  try {
    redirect = await RedirectUrl.getFinal(url.href, true);
  } catch (e) {
    console.log(e);
    throw new ApolloError(
      "There was an error loading the page. The url might not be valid.",
      "PAGE_LOAD_ERROR"
    );
  }

  return redirect.embeddable;
};

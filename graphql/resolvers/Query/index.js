import applicationById from "./applicationById";
import applicationByUrl from "./applicationByUrl";
import applications from "./applications";
import archivedApplications from "./archivedApplications";
import authenticatedUser from "./authenticatedUser";
import currentApplications from "./currentApplications";
import date from "./date";
import faqById from "./faqById";
import faqByUrl from "./faqByUrl";
import faqs from "./faqs";
import isEmbeddable from "./isEmbeddable";
import userById from "./userById";
import users from "./users";

const Query = {
  applications,
  applicationById,
  applicationByUrl,
  archivedApplications,
  authenticatedUser,
  currentApplications,
  date,
  faqById,
  faqByUrl,
  faqs,
  userById,
  users,
  isEmbeddable,
};

export default Query;

import createApplication from "./createApplication";
import createFAQ from "./createFAQ";
import deleteApplication from "./deleteApplication";
import deleteFAQ from "./deleteFAQ";
import editApplication from "./editApplication";
import editFAQ from "./editFAQ";
import editGoogleDriveAnonymityFileId from "./editGoogleDriveAnonymityFileId";
import editResultsByApplicationId from "./editResultsByApplicationId";
import editUser from "./editUser";
import login from "./login";
import logout from "./logout";
import recordAnonymityIdByApplicationId from "./recordAnonymityIdByApplicationId";
import recordApplicantEmailByApplicationId from "./recordApplicantEmailByApplicationId";

export default {
  createFAQ,
  deleteFAQ,
  editFAQ,
  createApplication,
  editApplication,
  deleteApplication,
  editGoogleDriveAnonymityFileId,
  editResultsByApplicationId,
  login,
  logout,
  editUser,
  recordApplicantEmailByApplicationId,
  recordAnonymityIdByApplicationId,
};

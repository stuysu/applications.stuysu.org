import { createContext } from "react";

export const defaultValue = {
  signedIn: false,
  adminPrivileges: false,
  id: null,
  firstName: null,
  lastName: null,
  name: null,
  email: null,
  picture: null,
  loaded: false,
  anonymitySecret: null,
  googleDriveAnonymityFileId: null,
};

const UserContext = createContext(defaultValue);

export default UserContext;

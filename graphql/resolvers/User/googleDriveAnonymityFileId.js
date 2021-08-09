import { ForbiddenError } from "apollo-server-micro";

export default (desiredUser, __, { user }) => {
  if (desiredUser.id.toString() === user.id.toString()) {
    return user.googleDriveAnonymityFileId;
  }

  throw new ForbiddenError(
    "You are not allowed to access the anonymity file ids of other users"
  );
};

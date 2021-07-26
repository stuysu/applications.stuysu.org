import { ForbiddenError, UserInputError } from "apollo-server-micro";
import User from "../../../models/user";

export default async (_, { id, adminPrivileges }, { adminRequired, user }) => {
  adminRequired();

  if (user.id.toString() === id.toString()) {
    throw new ForbiddenError(
      "You are not allowed to remove your own admin privileges. Ask another user to do it for you if necessary"
    );
  }

  const u = await User.findById(id);

  if (!u) {
    throw new UserInputError("There is no user with that id");
  }

  u.adminPrivileges = adminPrivileges;
  await u.save();

  return u;
};

import User from "../../../models/user";

export default (_, { id }, { adminRequired }) => {
  adminRequired();

  return User.findById(id);
};

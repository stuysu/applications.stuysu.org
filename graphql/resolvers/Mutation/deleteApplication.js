import { UserInputError } from "apollo-server-micro";
import Application from "../../../models/application";

export default async (_, { id }, { adminRequired }) => {
  adminRequired();
  const application = await Application.findById(id);

  if (!application) {
    throw new UserInputError("There's no application with that id");
  }

  await Application.deleteOne({ _id: id.toString() });
};

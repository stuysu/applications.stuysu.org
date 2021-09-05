import { UserInputError } from "apollo-server-micro";
import Application from "../../../models/application";

export default async (_, { id }, { authenticationRequired, user }) => {
  authenticationRequired();
  const application = await Application.findById(id);

  if (!application) {
    throw new UserInputError("There's no application with that id");
  }

  if (!application.applicantEmails.includes(user.email)) {
    await Application.updateOne(
      { _id: id.toString() },
      {
        $push: {
          applicantEmails: user.email,
        },
      }
    );
  }
};

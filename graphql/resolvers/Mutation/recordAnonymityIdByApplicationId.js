import { ForbiddenError, UserInputError } from "apollo-server-micro";
import Application from "../../../models/application";

export default async (
  _,
  { id, anonymityId },
  { user, authenticationRequired }
) => {
  authenticationRequired();

  let application = await Application.findById(id);

  if (!application) {
    throw new UserInputError("There is no application with that id");
  }

  if (application.active) {
    throw new ForbiddenError(
      "You must wait for the application to close before reporting your id."
    );
  }

  if (application.applicants.some(a => a.userId === user.id)) {
    throw new ForbiddenError(
      "The anonymity id of this applicant has already been recorded and cannot be modified"
    );
  }

  await Application.updateOne(
    { _id: id },
    {
      $push: {
        userId: user.id,
        anonymityId,
        createdAt: new Date(),
      },
    }
  );

  // We need to fetch it again since we updated it async
  application = await Application.findById(application.id);

  return application.applicants.find(a => a.userId === user.id);
};

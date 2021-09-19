import { UserInputError } from "apollo-server-micro";
import Application from "../../../models/application";

export default async (
  _,
  { id, acceptedIds, acceptanceMessage, rejectedIds, rejectionMessage },
  { adminRequired }
) => {
  adminRequired();

  const application = await Application.findById(id);

  if (!application) {
    throw new UserInputError("There's no application with that id");
  }

  acceptedIds = Array.from(new Set(acceptedIds));
  rejectedIds = Array.from(new Set(rejectedIds));

  acceptedIds.forEach(id => application.results.map.set(id, "accepted"));
  rejectedIds.forEach(id => application.results.map.set(id, "rejected"));

  application.results.acceptedIds = acceptedIds;
  application.results.acceptanceMessage = acceptanceMessage;

  application.results.rejectedIds = rejectedIds;
  application.results.rejectionMessage = rejectionMessage;

  await application.save();

  return application.results;
};

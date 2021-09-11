import { UserInputError } from "apollo-server-micro";
import isUrl from "is-url";
import Application from "../../../models/application";
import sanitizeHtml from "../../../utils/content/sanitizeHtml";

export default async (
  _,
  {
    id,
    title,
    url,
    link,
    embed,
    type,
    deadline,
    color,
    more,
    active,
    archived,
  },
  { adminRequired }
) => {
  adminRequired();

  const application = await Application.findById(id);

  if (!application) {
    throw new UserInputError("There's no application with that id");
  }

  if (link && !isUrl(link)) {
    throw new UserInputError(
      "The provided url for the application is not valid"
    );
  }

  if (title.length > 128) {
    throw new UserInputError(
      "The title field cannot be longer than 128 characters"
    );
  }

  if (url.length > 128) {
    throw new UserInputError(
      "The url field cannot be longer than 128 characters"
    );
  }

  if (!link && embed) {
    throw new UserInputError(
      "The embed field can only be set to true when an application link is provided"
    );
  }

  if (more) {
    more = sanitizeHtml(more);
  }

  application.title = title;
  application.url = url;
  application.link = link;
  application.embed = embed;
  application.type = type;
  application.deadline = deadline;
  application.color = color;
  application.more = more;
  application.active = active;
  application.archived = archived;
  application.updatedAt = new Date();

  await application.save();
  return application;
};

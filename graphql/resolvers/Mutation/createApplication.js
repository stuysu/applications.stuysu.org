import { UserInputError } from "apollo-server-micro";
import isUrl from "is-url";
import Application from "../../../models/application";
import sanitizeHtml from "../../../utils/content/sanitizeHtml";

export default async (
  _,
  { title, url, link, embed, type, deadline, color, more },
  { adminRequired }
) => {
  adminRequired();

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

  return await Application.create({
    title,
    url,
    link,
    type,
    deadline,
    color,
    more,

    embed: link ? embed : false,

    createdAt: new Date(),
    updatedAt: new Date(),

    active: true,
    archived: false,
    applicantEmails: [],
  });
};

import { UserInputError } from "apollo-server-micro";
import FAQ from "../../../models/faq";
import sanitizeHtml from "../../../utils/content/sanitizeHtml";

export default async (_, { title, url, body }, { adminRequired }) => {
  adminRequired();

  // Check if there's already an faq at that url
  const existing = await FAQ.findOne({ url });

  if (existing) {
    throw new UserInputError("There's already another FAQ with that url.");
  }

  if (url.length > 50) {
    throw new UserInputError(
      "The url field cannot be longer than 50 characters"
    );
  }

  if (title.length > 200) {
    throw new UserInputError(
      "The title field cannot be longer than 200 characters"
    );
  }

  body = sanitizeHtml(body);

  if (!body) {
    throw new UserInputError("The body field cannot be empty");
  }

  const updatedAt = new Date();
  const createdAt = new Date();

  return await FAQ.create({
    title,
    url,
    body,
    updatedAt,
    createdAt,
  });
};

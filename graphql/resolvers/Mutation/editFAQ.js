import { UserInputError } from "apollo-server-micro";
import FAQ from "../../../models/faq";
import sanitizeHtml from "../../../utils/content/sanitizeHtml";

export default async (_, { id, title, url, body }, { adminRequired }) => {
  adminRequired();

  const faq = await FAQ.findById(id);

  if (!faq) {
    throw new UserInputError("There's no faq with that id");
  }

  if (title.length > 200) {
    throw new UserInputError(
      "The title field must be less than 200 characters"
    );
  }

  if (url.length > 50) {
    throw new UserInputError("The url field must be less than 50 characters");
  }

  body = sanitizeHtml(body);

  if (!body) {
    throw new UserInputError("The body field cannot be empty");
  }

  faq.title = title;
  faq.url = url;
  faq.body = body;
  faq.updatedAt = new Date();

  await faq.save();

  return faq;
};

import { UserInputError } from "apollo-server-micro";
import FAQ from "../../../models/faq";

export default async (_, { id }, { adminRequired }) => {
  adminRequired();

  const faq = await FAQ.findById(id);

  if (!faq) {
    throw new UserInputError("There's no FAQ with that id");
  }

  await FAQ.deleteOne({ _id: id });
};

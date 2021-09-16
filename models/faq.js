import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";
import mongoose from "./mongoose";
import queryFAQs from "./statics/faq/queryFAQs";

const Schema = mongoose.Schema;

const FAQSchema = new Schema({
  title: String,
  url: { type: String, required: true, maxlength: 50 },
  body: String,
  plainTextBody: String,
  createdAt: Date,
  updatedAt: Date,
});

FAQSchema.statics.idLoader = findOneLoaderFactory("FAQ", "_id");
FAQSchema.statics.urlLoader = findOneLoaderFactory("FAQ", "url");
FAQSchema.statics.queryFAQs = queryFAQs;

const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", FAQSchema);

export default FAQ;

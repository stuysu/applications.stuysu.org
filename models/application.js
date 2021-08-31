import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";
import mongoose from "./mongoose";
import queryApplications from "./statics/application/queryApplications";

const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
  title: String,
  url: String,
  link: String,
  embed: Boolean,

  type: {
    type: String,
    values: ["anonymous", "hybrid"],
    default: "anonymous",
  },

  color: String,
  more: String,

  // If hybrid this will contain an array of email addresses
  applicants: [String],

  deadline: Date,

  createdAt: Date,
  updatedAt: Date,

  active: Boolean,
  archived: Boolean,
});

ApplicationSchema.statics.idLoader = findOneLoaderFactory("Application");
ApplicationSchema.statics.queryApplications = queryApplications;

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);

export default Application;

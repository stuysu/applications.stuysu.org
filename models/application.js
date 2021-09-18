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

  deadline: Date,

  createdAt: Date,
  updatedAt: Date,

  active: Boolean,
  archived: Boolean,

  applicantEmails: [String],

  results: {
    acceptedIds: [
      {
        type: String,
        validate: /^[a-f0-9]{8}$/i,
      },
    ],
    rejectedIds: [
      {
        type: String,
        validate: /^[a-f0-9]{8}$/i,
      },
    ],
    acceptanceMessage: {
      type: String,
      default: "",
    },
    rejectionMessage: {
      type: String,
      default: "",
    },
  },
});

ApplicationSchema.statics.idLoader = findOneLoaderFactory("Application");
ApplicationSchema.statics.queryApplications = queryApplications;

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);

export default Application;

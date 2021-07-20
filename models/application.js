import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";
import mongoose from "./mongoose";

const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
  type: [
    {
      type: String,
      values: ["anonymous", "hybrid"],
      default: "anonymous",
    },
  ],
  title: String,
  description: String,
  color: String,
  createdAt: Date,
  updatedAt: Date,
  status: Boolean,
  archived: Boolean,
});

ApplicationSchema.statics.idLoader = findOneLoaderFactory("Application");

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);

export default Application;

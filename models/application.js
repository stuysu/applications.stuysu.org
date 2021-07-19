import mongoose from "./mongoose";
import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";

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
  active: Boolean,
});

ApplicationSchema.statics.idLoader = findOneLoaderFactory("Application");

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);

export default Application;

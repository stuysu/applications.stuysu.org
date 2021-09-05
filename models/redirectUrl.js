import findOneLoaderFactory from "../utils/dataloaders/findOneLoaderFactory";
import mongoose from "./mongoose";
import getFinal from "./statics/redirectUrl/getFinal";

const Schema = mongoose.Schema;

const RedirectUrlSchema = new Schema({
  original: String,
  final: String,
  expiration: Date,
});

const fiveMinutes = 1000 * 60 * 5;

RedirectUrlSchema.statics.maxAge = fiveMinutes;
RedirectUrlSchema.statics.idLoader = findOneLoaderFactory("RedirectUrl", "_id");
RedirectUrlSchema.statics.urlLoader = findOneLoaderFactory(
  "RedirectUrl",
  "original"
);

RedirectUrlSchema.statics.getFinal = getFinal;

const RedirectUrl =
  mongoose.models.RedirectUrl ||
  mongoose.model("RedirectUrl", RedirectUrlSchema);

export default RedirectUrl;

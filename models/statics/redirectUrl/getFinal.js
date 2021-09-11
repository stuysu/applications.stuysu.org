import axios from "axios";
import mongoose from "./../../mongoose";

export default async function getFinal(original, skipCache = false) {
  const model = mongoose.model("RedirectUrl");
  const now = new Date();

  let record;

  if (!skipCache) {
    record = await model.findOne({
      original,
    });
  }

  if (!record || record.expiration > now) {
    await model.deleteMany({
      expiration: { $gt: now },
    });

    const { request, headers } = await axios.get(original, { maxRedirects: 5 });

    const embeddable = headers["x-frame-options"]?.toLowerCase() !== "deny";

    const final = request.res.responseUrl;
    const expiration = new Date(Date.now() + model.maxAge);

    record = await model.create({
      original,
      final,
      expiration,
      embeddable,
    });
  }

  return record;
}

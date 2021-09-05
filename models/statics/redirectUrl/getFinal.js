import axios from "axios";
import mongoose from "./../../mongoose";

export default async function getFinal(original) {
  const model = mongoose.model("RedirectUrl");
  const now = new Date();

  let record = await model.findOne({
    original,
  });

  if (!record || record.expiration > now) {
    await model.deleteMany({
      expiration: { $gt: now },
    });

    const { request } = await axios.get(original, { maxRedirects: 5 });

    const final = request.res.responseUrl;
    const expiration = new Date(Date.now() + model.maxAge);

    record = await model.create({
      original,
      final,
      expiration,
    });
  }

  return record;
}

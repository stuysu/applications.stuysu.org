import mongoose from "./../../mongoose";

export default function findByGoogleId(googleUserId) {
  return mongoose.model("User").findOne({ googleUserId });
}

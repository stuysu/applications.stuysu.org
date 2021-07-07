import mongoose from "./../../mongoose";

export default function findByGoogleId(googleId) {
  return mongoose.model("User").findOne({ googleId });
}

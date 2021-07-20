import mongoose from "./../../mongoose";

export default function getValidPairs() {
  const now = new Date();

  return mongoose.model("KeyPair").find({
    expiration: {
      $gt: now,
    },
  });
}

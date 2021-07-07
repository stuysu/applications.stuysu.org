import mongoose from "./../../mongoose";
import KeyPair from "../../keyPair";

export default function getValidPairs() {
  const now = new Date();

  return mongoose.model("KeyPair").find({
    expiration: {
      $gt: now,
    },
  });
}

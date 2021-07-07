import mongoose from "./../../mongoose";

export default async function getSigningPair() {
  const KeyPair = mongoose.model("KeyPair");

  const earliestAllowedExpiration = new Date(
    Date.now() + KeyPair.signingBuffer
  );

  const currentKey = await KeyPair.findOne({
    expiration: {
      $gt: earliestAllowedExpiration,
    },
  });

  if (currentKey) {
    return currentKey;
  }

  return await KeyPair.generateNewKeyPair();
}

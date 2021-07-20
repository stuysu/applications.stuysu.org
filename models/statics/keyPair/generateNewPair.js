import generateSecureKeyPair from "../../../utils/auth/generateSecureKeyPair";
import mongoose from "./../../mongoose";

export default async function generateNewPair() {
  const KeyPair = mongoose.model("KeyPair");

  // Delete all existing keys
  await KeyPair.deleteMany({});

  const { privateKey, publicKey, passphrase } = await generateSecureKeyPair();

  const expiration = new Date(Date.now() + KeyPair.maxAge);

  return await KeyPair.create({
    privateKey,
    publicKey,
    passphrase,
    expiration,
  });
}

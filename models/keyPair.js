import mongoose from "./mongoose";
import generateNewPair from "./statics/keyPair/generateNewPair";
import getSigningPair from "./statics/keyPair/getSigningPair";
import getValidPairs from "./statics/keyPair/getValidPairs";

const Schema = mongoose.Schema;

const KeyPairSchema = new Schema({
  privateKey: String,
  publicKey: String,
  passphrase: String,
  expiration: Date,
});

const oneYear = 1000 * 60 * 60 * 24 * 365;
const thirtyDays = 1000 * 60 * 60 * 24 * 30;

KeyPairSchema.statics.maxAge = oneYear;

// Stop signing with the current key if there's less than thirty days till expiration
KeyPairSchema.statics.signingBuffer = thirtyDays;

KeyPairSchema.statics.generateNewPair = generateNewPair;
KeyPairSchema.statics.getSigningPair = getSigningPair;
KeyPairSchema.statics.getValidPairs = getValidPairs;

const KeyPair =
  mongoose.models.KeyPair || mongoose.model("KeyPair", KeyPairSchema);

export default KeyPair;

import { verify } from "jsonwebtoken";
import KeyPair from "../../models/keyPair";

const silentVerify = async (jwt, publicKey) => {
  try {
    return await verify(jwt, publicKey);
  } catch (e) {
    return null;
  }
};

const getJWTData = async jwt => {
  /** @type Array */
  const validKeyPairs = await KeyPair.getValidPairs();

  let data;

  for (let i = 0; i < validKeyPairs.length; i++) {
    const { publicKey } = validKeyPairs[i];
    data = await silentVerify(jwt, publicKey);

    if (data) {
      return data;
    }
  }

  return null;
};

export default getJWTData;

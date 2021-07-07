import { generateKeyPair, randomBytes } from "crypto";

export default function generateSecureKeyPair(
  passphrase,
  modulusLength = 2048
) {
  if (!passphrase) {
    passphrase = randomBytes(16).toString("hex");
  }

  return new Promise((resolve, reject) => {
    generateKeyPair(
      "rsa",
      {
        modulusLength,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
          cipher: "aes-256-cbc",
          passphrase,
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          reject(err);
        } else {
          resolve({ publicKey, privateKey, passphrase });
        }
      }
    );
  });
}

import { ForbiddenError } from "apollo-server-micro";
import { sign } from "jsonwebtoken";
import KeyPair from "../../../models/keyPair";
import User from "../../../models/user";
import getIdTokenPayload from "../../../utils/auth/getIdTokenPayload";
import validateIdTokenPayload from "../../../utils/auth/validateIdTokenPayload";

export default async (_, { idToken }, { signedIn, setCookie }) => {
  if (signedIn) {
    throw new ForbiddenError("You are already signed in.");
  }

  const idTokenPayload = await getIdTokenPayload(idToken);
  validateIdTokenPayload(idTokenPayload);

  let user = await User.findByGoogleId(idTokenPayload.sub);

  if (user) {
    // If the user updated their account update locally
    user.firstName = idTokenPayload.given_name;
    user.lastName = idTokenPayload.family_name;
    user.picture =
      idTokenPayload.picture ||
      "https://res.cloudinary.com/stuyactivities/image/upload/v1693526145/placeholder_pfp.png";
    user.email = idTokenPayload.email.toLowerCase();

    await user.save();
  } else {
    // Add the user to the database if they don't exist
    user = await User.create({
      googleUserId: idTokenPayload.sub,
      firstName: idTokenPayload.given_name,
      lastName: idTokenPayload.family_name,
      email: idTokenPayload.email,
      picture:
        idTokenPayload.picture ||
        "https://res.cloudinary.com/stuyactivities/image/upload/v1693526145/placeholder_pfp.png",
      adminPrivileges: false,
    });
  }

  const { id } = user;

  const { privateKey, passphrase } = await KeyPair.getSigningPair();

  const token = await sign(
    {
      user: {
        id,
      },
    },
    { key: privateKey, passphrase },
    { algorithm: "RS256", expiresIn: "30d" }
  );

  setCookie("jwt", token, {
    maxAge: 1000 * 60 * 24 * 30,
    path: "/",
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  return token;
};

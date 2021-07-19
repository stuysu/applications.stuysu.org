import { ForbiddenError, UserInputError } from "apollo-server-micro";
import getAccessTokenPayload from "../../../utils/auth/getAccessTokenPayload";
import validateAccessTokenPayload from "../../../utils/auth/validateAccessTokenPayload";
import User from "../../../models/user";
import getIdTokenPayload from "../../../utils/auth/getIdTokenPayload";
import validateIdTokenPayload from "../../../utils/auth/validateIdTokenPayload";
import { sign } from "jsonwebtoken";
import KeyPair from "../../../models/keyPair";

export default async (_, { accessToken, idToken }, { signedIn, setCookie }) => {
  if (signedIn) {
    throw new ForbiddenError("You are already signed in.");
  }

  const accessTokenPayload = await getAccessTokenPayload(accessToken);
  validateAccessTokenPayload(accessTokenPayload);

  const idTokenPayload = await getIdTokenPayload(idToken);
  validateIdTokenPayload(idTokenPayload);

  // Now make sure that both of them belong to the same user
  if (idTokenPayload.sub !== accessTokenPayload.user_id) {
    throw new ForbiddenError(
      "The access token and id token do not belong to the same user"
    );
  }

  let user = await User.findByGoogleId(idTokenPayload.sub);

  if (!user) {
    // Add the user to the database
    user = await User.create({
      googleUserId: idTokenPayload.sub,
      firstName: idTokenPayload.given_name,
      lastName: idTokenPayload.family_name,
      email: idTokenPayload.email,
      picture: idTokenPayload.picture,
      adminPrivileges: false,
    });
  }

  const anonymitySecret = await user.getAnonymitySecret(accessToken);
  const { id, firstName, lastName, email } = user;

  const { privateKey, passphrase } = await KeyPair.getSigningPair();

  const token = await sign(
    {
      user: {
        id,
        firstName,
        lastName,
        email,
        anonymitySecret,
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
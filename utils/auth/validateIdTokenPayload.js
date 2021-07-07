import { ForbiddenError } from "apollo-server-micro";
import { GOOGLE_CLIENT_ID } from "../../constants";

// Any checks that need to be performed on the idToken payload can be performed here
export default function validateIdTokenPayload(payload) {
  // Make sure the payload actually exists
  if (!payload) {
    throw new ForbiddenError(
      "That idToken is not valid and cannot be used to authenticate."
    );
  }

  // Make sure the user isn't using an unverified account
  if (!payload.email_verified) {
    throw new ForbiddenError(
      "Your email is not verified and cannot be used for sign in yet."
    );
  }

  // Make sure that the token the user is using was generated for this app
  if (payload.azp !== GOOGLE_CLIENT_ID || payload.aud !== GOOGLE_CLIENT_ID) {
    throw new ForbiddenError(
      "That login token was not generated for this app and cannot be used."
    );
  }

  if (payload.hd !== "stuy.edu") {
    throw new ForbiddenError(
      "That email address does not belong to the stuy.edu organization and cannot be used to authenticate."
    );
  }
}

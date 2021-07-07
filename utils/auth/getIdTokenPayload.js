import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID } from "../../constants";

export default async function getIdTokenPayload(idToken) {
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    // Once the token is verified return the payload
    return ticket.getPayload();
  } catch (e) {
    // If the token can't be verified, return null
    return null;
  }
}

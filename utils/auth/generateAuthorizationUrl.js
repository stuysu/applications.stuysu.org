import { GOOGLE_CLIENT_ID } from "../../constants";

const driveScope = "https://www.googleapis.com/auth/drive.file";

export default function generateAuthorizationUrl({ hint, state, prompt }) {
  const authorizationUrl = new globalThis.URL(
    "https://accounts.google.com/o/oauth2/v2/auth"
  );

  const redirectUri = new globalThis.URL(
    "/setup-anonymity-secret",
    window.location.origin
  );

  authorizationUrl.searchParams.append("client_id", GOOGLE_CLIENT_ID);
  authorizationUrl.searchParams.append("redirect_uri", redirectUri.href);

  authorizationUrl.searchParams.append("response_type", "token");
  authorizationUrl.searchParams.append("scope", driveScope);
  authorizationUrl.searchParams.append("state", state);
  authorizationUrl.searchParams.append("login_hint", hint);
  authorizationUrl.searchParams.append("include_granted_scopes", "true");
  authorizationUrl.searchParams.append("hd", "stuy.edu");
  authorizationUrl.searchParams.append("prompt", prompt);

  return authorizationUrl.href;
}

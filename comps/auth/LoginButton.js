import { gql, useMutation } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import ReactGA from "react-ga";
import { GOOGLE_CLIENT_ID } from "../../constants";
import generateAuthorizationUrl from "../../utils/auth/generateAuthorizationUrl";
import useScript from "../../utils/hooks/useScript";
import alertDialog from "../dialog/alertDialog";
import UserContext from "./UserContext";

const MUTATION = gql`
  mutation ($idToken: JWT!) {
    login(idToken: $idToken)
  }
`;

export default function LoginButton() {
  const [login, { loading }] = useMutation(MUTATION);
  const scriptStatus = useScript("https://accounts.google.com/gsi/client");
  const [initialized, setInitialized] = useState(false);
  const user = useContext(UserContext);
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const callback = async ({ credential }) => {
      if (globalThis.window) {
        ReactGA.event({
          category: "Session",
          action: "User Successfully completed ID portion of login",
          label: "Google",
          nonInteraction: false,
        });
      }

      // Credential is a jwt with the user info.
      // We're going to use it to login first and that'll let us know if it's valid
      // If it's valid with can deconstruct it locally without needing to verify it again

      try {
        const { data } = await login({ variables: { idToken: credential } });

        window.localStorage.setItem("jwt", data.login);

        const profile = JSON.parse(atob(credential.split(".")[1]));
        window.location.href = generateAuthorizationUrl({
          hint: profile.sub,
          prompt: "none",
          state: globalThis.window?.location.pathname,
        });
      } catch (e) {
        await alertDialog({ title: "Error Logging In", body: e.message });
      }
    };
    if (user.loaded && !user.signedIn && scriptStatus === "ready") {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        cancel_on_tap_outside: true,
        callback,
        hosted_domain: "stuy.edu",
      });

      setInitialized(true);

      window.google.accounts.id.prompt(notification => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // continue with another identity provider.
          console.log("One Tap isn't supported in this browser");

          if (globalThis.window) {
            ReactGA.event({
              category: "Event",
              action: "One Tap prompt was not displayed",
              label: "Google",
              nonInteraction: true,
            });
          }
        } else {
          if (globalThis.window) {
            ReactGA.event({
              category: "Event",
              action: "One Tap prompt was successfully displayed",
              label: "Google",
              nonInteraction: true,
            });
          }
        }
      });
    }
  }, [user, scriptStatus]);

  useEffect(() => {
    if (initialized && ref.current) {
      window.google.accounts.id.renderButton(ref.current, {
        type: "standard",
        size: "medium",
      });
    }
  }, [initialized, ref.current]);

  if (loading) {
    return <CircularProgress />;
  }

  return <div ref={ref} />;
}

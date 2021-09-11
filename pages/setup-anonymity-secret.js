import { gql, useMutation } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import qs from "querystring";
import { useCallback, useContext, useEffect, useState } from "react";
import ReactGA from "react-ga";
import UserContext from "../comps/auth/UserContext";
import confirmDialog from "../comps/dialog/confirmDialog";
import styles from "../styles/Home.module.css";
import generateAuthorizationUrl from "../utils/auth/generateAuthorizationUrl";

const EDIT_MUTATION = gql`
  mutation ($fileId: NonEmptyString!) {
    editGoogleDriveAnonymityFileId(fileId: $fileId)
  }
`;

export default function SetupAnonymitySecret() {
  const user = useContext(UserContext);
  const router = useRouter();
  const { referrer } = router.query;
  const [edit] = useMutation(EDIT_MUTATION);
  const [prompting, setPrompting] = useState(false);
  const hash = qs.parse(
    router.asPath.substring(router.asPath.indexOf("#") + 1)
  );
  const accessToken = hash.access_token;

  const userNeedsToAuthorize =
    !accessToken ||
    hash.error === "interaction_required" ||
    !hash.scope?.includes("https://www.googleapis.com/auth/drive.file");

  useEffect(() => {
    if (!user.loaded) {
      return;
    }

    if (user.signedIn && userNeedsToAuthorize && !prompting) {
      if (globalThis.window) {
        ReactGA.event({
          category: "Session",
          action: "Prompted User For Google Drive",
          label: "Google",
          nonInteraction: true,
        });
      }

      setPrompting(true);
      confirmDialog({
        title: "One more step",
        body: (
          <>
            <Typography variant={"body1"} paragraph gutterBottom>
              This app needs the ability to store its app data in your Google
              Drive to function properly. You'll only need to do this once. To
              get a better understanding of why, visit this url:
              <br />
              <Link href={"/faq/why-google-drive"} target={"_blank"}>
                https://applications.stuysu.org/faq/why-google-drive.
              </Link>
            </Typography>
            <Typography variant={"body1"} paragraph>
              Click <b>Confirm</b> and we'll attempt the authorization
              procedure.
            </Typography>
          </>
        ),
      }).then(async auth => {
        window.location.replace(
          auth
            ? generateAuthorizationUrl({
                hint: user.email,
                state: hash.state || "/",
                prompt: "consent",
              })
            : "/"
        );
      });
    }
  }, [hash, user, prompting]);

  const generateSecret = async () => {
    const anonymitySecret = Array.from(
      globalThis.crypto.getRandomValues(new Uint32Array(5))
    )
      .map(a => a.toString(16).padStart(2, "0"))
      .join("");

    const image = await fetch("/anonymity-secret.png").then(res => res.blob());
    const { id: fileId } = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files",
      {
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer " + accessToken,
          "Content-Type": "image/png",
        }),
        body: image,
      }
    ).then(res => res.json());

    const url = new globalThis.URL(
      fileId,
      "https://www.googleapis.com/drive/v3/files/"
    );

    await fetch(url.href, {
      method: "PATCH",
      headers: new Headers({
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        appProperties: {
          anonymitySecret,
        },
        contentRestrictions: {
          readOnly: true,
          reason:
            "This file contains your anonymity secret for the StuySU Applications Site. Modifications will result in your current anonymous ids being lost and no longer accessible to you.",
        },
        name: "StuySU Applications Anonymity Secret",
        description:
          "This file contains your anonymity secret for applications.stuysu.org. Please don't delete or modify it.",
      }),
    });

    await edit({ variables: { fileId } });
    window.localStorage.setItem("anonymitySecret", anonymitySecret);

    if (globalThis.window) {
      ReactGA.event({
        category: "Session",
        action: "Successfully retrieved anonymity secret from drive",
        label: "Google",
        nonInteraction: true,
      });
    }

    return anonymitySecret;
  };

  const getSecret = useCallback(async () => {
    try {
      if (user.googleDriveAnonymityFileId) {
        const url = new globalThis.URL(
          user.googleDriveAnonymityFileId,
          "https://www.googleapis.com/drive/v3/files/"
        );

        url.searchParams.append("fields", "appProperties");

        const res = await fetch(url.href, {
          method: "GET",
          headers: new Headers({ Authorization: "Bearer " + accessToken }),
        }).then(r => r.json());

        if (res?.appProperties?.anonymitySecret) {
          return res?.appProperties?.anonymitySecret;
        }
      }
    } catch (e) {
      if (globalThis.window) {
        ReactGA.event({
          category: "Session",
          action:
            "Failed to retrieve existing anonymity secret from user's drive",
          label: user.email,
          nonInteraction: true,
        });
      }
    }

    return null;
  }, [user]);

  useEffect(() => {
    if (!userNeedsToAuthorize && user.signedIn) {
      getSecret()
        .then(async secret => {
          if (!secret) {
            secret = await generateSecret();
          }
          window.localStorage.setItem("anonymitySecret", secret);
          window.location.href = hash.state || referrer || "/";
        })
        .catch(er => {
          console.error(er);
        });
    }
  }, [accessToken, user]);

  if (!user.loaded) {
    return (
      <div className={styles.center}>
        <CircularProgress />
      </div>
    );
  }

  if (!user.signedIn || !accessToken) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Typography
        variant={"h4"}
        align={"center"}
        gutterBottom
        color={"primary"}
      >
        Getting Info From Google Drive
      </Typography>
      <Typography variant={"body1"} align={"center"} gutterBottom paragraph>
        Don't leave this page. It'll only take a second.
      </Typography>
      <div className={styles.center}>
        <CircularProgress className={styles.spinner} />
      </div>
    </div>
  );
}

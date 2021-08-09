import { gql, useMutation } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import UserContext from "../comps/auth/UserContext";
import styles from "../styles/Home.module.css";

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
  const [error, setError] = useState(false);
  const accessToken = globalThis?.sessionStorage?.getItem("accessToken");

  const generateSecret = async () => {
    const anonymitySecret = Array.from(
      globalThis.crypto.getRandomValues(new Uint32Array(6))
    )
      .map(a => a.toString(16))
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
    } catch (e) {}

    return null;
  }, [user]);

  useEffect(() => {
    if (accessToken && user.signedIn) {
      getSecret()
        .then(async secret => {
          if (!secret) {
            secret = await generateSecret();
          }
          window.localStorage.setItem("anonymitySecret", secret);
          window.location.href = referrer || "/";
        })
        .catch(er => {
          setError(er);
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
    router.push("/");
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

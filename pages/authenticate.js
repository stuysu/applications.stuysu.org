import { gql, useMutation } from "@apollo/client";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import qs from "querystring";
import { useEffect } from "react";
import LoginButton from "../comps/auth/LoginButton";
import styles from "./../styles/Home.module.css";

const MUTATION = gql`
  mutation ($idToken: JWT!) {
    login(idToken: $idToken)
  }
`;

export default function Authenticate() {
  const [login, { loading }] = useMutation(MUTATION);
  const router = useRouter();
  const query = qs.parse(
    router.asPath.substring(router.asPath.indexOf("#") + 1)
  );

  useEffect(() => {
    console.log(query);
  }, [query.error]);

  if (query.error === "access_denied") {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.mediumContentContainer}>
            <Typography variant={"h3"} gutterBottom>
              Unable To Authorize
            </Typography>
            <Typography variant={"body1"} paragraph gutterBottom>
              This app needs the ability to store its app data in your Google
              Drive to function properly. To get a better understanding of why,
              visit this url:
              <br />
              <Link href={"/faq/why-google-drive"} target={"_blank"}>
                https://applications.stuysu.org/faq/why-google-drive.
              </Link>
            </Typography>

            <Typography variant={"body1"} gutterBottom>
              Click the button below to restart the authentication process:
            </Typography>
            <LoginButton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <p>Authenticating...</p>
    </div>
  );
}

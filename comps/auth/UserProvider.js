import { gql, useQuery } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import styles from "../../styles/Home.module.css";
import useLogout from "../../utils/hooks/useLogout";
import UserContext, { defaultValue } from "./UserContext";

const QUERY = gql`
  query {
    authenticatedUser {
      id
      name
      firstName
      lastName
      email
      picture
      adminPrivileges
      googleDriveAnonymityFileId
    }
  }
`;

export default function UserProvider({ children }) {
  const { data, loading, error } = useQuery(QUERY);
  const [value, setValue] = useState(defaultValue);
  const { logout } = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      if (globalThis.window) {
        ReactGA.event({
          category: "Error",
          action: "Failed to load session information",
          label: new Date().toISOString(),
          nonInteraction: true,
        });
      }

      alert(
        "There was an error loading session information. Try refreshing the page."
      );
    }
  }, [error]);

  useEffect(() => {
    if (!loading) {
      const user = data.authenticatedUser;

      if (user) {
        const anonymitySecret = localStorage.getItem("anonymitySecret") || null;

        setValue({
          signedIn: true,
          adminPrivileges: user.adminPrivileges,
          id: user.id,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          picture: user.picture,
          loaded: true,
          googleDriveAnonymityFileId: user.googleDriveAnonymityFileId,
          anonymitySecret,
        });
      } else {
        setValue({ ...defaultValue, loaded: true });
      }
    }
  }, [data]);

  useEffect(() => {
    if (
      value.signedIn &&
      !value.anonymitySecret &&
      router.pathname !== "/setup-anonymity-secret"
    ) {
      if (globalThis.window) {
        ReactGA.event({
          category: "Session",
          action: "User Anonymity Secret Not Set",
          label: "Google",
          nonInteraction: true,
        });
      }

      setTimeout(() => logout(), 3000);
    }
  }, [value, router]);

  if (
    value.signedIn &&
    !value.anonymitySecret &&
    router.pathname !== "/setup-anonymity-secret"
  ) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <Typography variant={"h4"} color={"primary"}>
            It looks like you weren't authenticated correctly
          </Typography>

          <Typography variant={"body1"} gutterBottom>
            We're logging you out. Please go through the sign in process again.
          </Typography>

          <CircularProgress className={styles.spinner} />
        </main>
      </div>
    );
  }

  return <UserContext.Provider value={value} children={children} />;
}

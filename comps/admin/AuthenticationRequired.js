import Typography from "@material-ui/core/Typography";
import { useContext, useEffect } from "react";
import ReactGA from "react-ga";
import LoginButton from "../auth/LoginButton";
import UserContext from "../auth/UserContext";
import styles from "./AuthenticationRequired.module.css";

export default function AuthenticationRequired({ children }) {
  const user = useContext(UserContext);

  useEffect(() => {
    if (user.loaded && !user.signedIn && globalThis.window) {
      ReactGA.event({
        category: "Navigation",
        action: "Unauthenticated user viewed page requiring authentication",
        label: window.location.pathname,
        nonInteraction: false,
      });
    }
  }, [user]);

  if (!user.signedIn) {
    return (
      <div>
        <div className={styles.container}>
          <img
            src={"/authentication.svg"}
            alt={"A browser with a lock icon and a person entering a password"}
            className={styles.vector}
          />
          <Typography variant={"h3"} color={"error"} gutterBottom>
            You need to be logged in to access this page.
          </Typography>
          <div className={styles.center}>
            <LoginButton />
          </div>
        </div>
      </div>
    );
  }

  return children;
}

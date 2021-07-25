import Typography from "@material-ui/core/Typography";
import { useContext } from "react";
import LoginButton from "../auth/LoginButton";
import UserContext from "../auth/UserContext";
import styles from "./AuthenticationRequired.module.css";

export default function AuthenticationRequired({ children }) {
  const user = useContext(UserContext);

  if (!user.signedIn) {
    return (
      <div className={styles.container}>
        <img
          src={"/authentication.svg"}
          alt={"A browser with a lock icon and a person entering a password"}
          className={styles.vector}
        />
        <Typography variant={"h3"} color={"error"} gutterBottom>
          You need to be logged in to access this page.
        </Typography>
        <LoginButton />
      </div>
    );
  }

  return children;
}
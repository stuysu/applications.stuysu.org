import Typography from "@material-ui/core/Typography";
import { useContext } from "react";
import UserContext from "../auth/UserContext";
import styles from "./AdminRequired.module.css";
import AuthenticationRequired from "./AuthenticationRequired";

export default function AdminRequired({ children }) {
  const user = useContext(UserContext);

  if (!user.signedIn) {
    return <AuthenticationRequired />;
  }

  if (!user.adminPrivileges) {
    return (
      <div className={styles.container}>
        <img
          src={"/access-denied.svg"}
          alt={"Someone standing next to a phone with an x on it"}
          className={styles.vector}
        />
        <Typography variant={"h3"} color={"error"}>
          You need to be an admin in order to access this page.
        </Typography>
      </div>
    );
  }

  return children;
}

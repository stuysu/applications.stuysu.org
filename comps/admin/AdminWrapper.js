import { CircularProgress } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import { useContext } from "react";
import UserContext from "../auth/UserContext";
import Navigation from "../nav/Navigation";
import styles from "./AdminWrapper.module.css";
import AuthenticationRequired from "./AuthenticationRequired";

export default function AdminWrapper({ children }) {
  const user = useContext(UserContext);
  const router = useRouter();

  if (router.pathname.startsWith("/admin")) {
    if (!user.loaded) {
      return (
        <div className={styles.container}>
          <div className={styles.center}>
            <CircularProgress />
          </div>
        </div>
      );
    }

    if (!user.signedIn) {
      return <AuthenticationRequired />;
    }

    if (!user.adminPrivileges) {
      return (
        <div>
          <Navigation />
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
        </div>
      );
    }
  }

  return children;
}
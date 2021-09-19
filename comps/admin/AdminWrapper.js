import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import ReactGA from "react-ga";
import UserContext from "../auth/UserContext";
import Navigation from "../nav/Navigation";
import styles from "./AdminWrapper.module.css";
import AuthenticationRequired from "./AuthenticationRequired";

export default function AdminWrapper({ children }) {
  const user = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (
      user.loaded &&
      router.pathname.startsWith("/admin") &&
      !user.adminPrivileges &&
      globalThis.window
    ) {
      ReactGA.event({
        category: "Navigation",
        action: "Non admin user viewed admin page",
        label: window.location.pathname,
        nonInteraction: false,
      });
    }
  }, [router, user]);

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

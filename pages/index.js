import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import Head from "next/head";
import { useContext } from "react";
import LoginButton from "../comps/auth/LoginButton";
import UserContext from "../comps/auth/UserContext";
import styles from "../styles/Home.module.css";
import useLogout from "../utils/hooks/useLogout";

export default function Home() {
  const user = useContext(UserContext);
  const { logout, loading } = useLogout();

  return (
    <div className={styles.container}>
      <Head>
        <title>StuySU Applications</title>
      </Head>

      <main className={styles.main}>
        {!user.signedIn && (
          <>
            <img
              src={"/form.svg"}
              className={styles.vector}
              alt={"Vector of someone filling out a form"}
            />
            <Typography variant={"h4"} gutterBottom>
              Let's get you signed in first
            </Typography>
            <LoginButton />
          </>
        )}

        {user.signedIn && (
          <>
            <Typography variant={"h4"} gutterBottom>
              Signed in as <b>{user.name}</b>
            </Typography>
            <Typography
              variant={"body1"}
              children={user.email}
              color={"primary"}
              gutterBottom
            />
            <Button
              variant={"outlined"}
              onClick={logout}
              disabled={loading}
              children={"Log out"}
              startIcon={
                loading ? <CircularProgress size={16} /> : <PowerSettingsNew />
              }
            />
          </>
        )}
      </main>
    </div>
  );
}

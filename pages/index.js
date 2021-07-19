import Head from "next/head";
import styles from "../styles/Home.module.css";
import LoginButton from "../comps/auth/LoginButton";
import { useContext } from "react";
import UserContext from "../comps/auth/UserContext";
import Footer from "../comps/ui/Footer.js";
import Typography from "@material-ui/core/Typography";

export default function Home() {
  const user = useContext(UserContext);
  return (
    <div className={styles.container}>
      <Head>
        <title>StuySU Applications</title>
      </Head>

      <main className={styles.main}>
        <Typography variant="h2" align="center" gutterBottom>
          StuySU Applications Site
        </Typography>
        <LoginButton />
      </main>

      <Footer />
    </div>
  );
}

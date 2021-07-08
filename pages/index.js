import Head from "next/head";
import styles from "../styles/Home.module.css";
import LoginButton from "../comps/auth/LoginButton";
import { useContext } from "react";
import UserContext from "../comps/auth/UserContext";

export default function Home() {
  const user = useContext(UserContext);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <pre>{JSON.stringify(user, null, 2)}</pre>
        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <LoginButton />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/stuysu/applications.stuysu.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          View source on
          <img
            src="/github-logo.png"
            alt="Vercel Logo"
            className={styles.logo}
          />{" "}
          <b>GitHub</b>
        </a>
      </footer>
    </div>
  );
}

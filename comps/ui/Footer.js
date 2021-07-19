import styles from "./Footer.module.css";

export default function Footer() {
  return (
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
  );
}

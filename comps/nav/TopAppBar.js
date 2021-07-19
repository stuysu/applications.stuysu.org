import { useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./TopAppBar.module.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import UserContext from "../auth/UserContext";

export default function TopAppBar() {
  const user = useContext(UserContext);
  const { pathname } = useRouter();

  return (
    <div className={styles.root}>
      <AppBar position="static" className={styles.appBar} elevation={0}>
        <Toolbar>
          <Typography variant="h6" className={styles.title}>
            StuySU Applications Site
          </Typography>

          <div className={styles.tabs}>
            {user.adminPrivileges && (
              <Link href="/admin">
                <a>
                  <Button
                    className={styles.tab}
                    color={
                      pathname.startsWith("/admin") ? "primary" : undefined
                    }
                  >
                    Admin
                  </Button>
                </a>
              </Link>
            )}

            <Link href="/">
              <a>
                <Button
                  className={styles.tab}
                  color={pathname === "/" ? "primary" : undefined}
                >
                  Home
                </Button>
              </a>
            </Link>

            <Link href="/faq">
              <a>
                <Button
                  className={styles.tab}
                  color={pathname.startsWith("/faq") ? "primary" : undefined}
                >
                  FAQs
                </Button>
              </a>
            </Link>
          </div>

          <IconButton
            edge="start"
            className={styles.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

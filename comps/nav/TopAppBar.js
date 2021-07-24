import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import useLogout from "../auth/useLogout";
import UserContext from "../auth/UserContext";
import styles from "./TopAppBar.module.css";

export default function TopAppBar({ setDrawerOpen, pages }) {
  const user = useContext(UserContext);
  const { logout, loading } = useLogout();
  const { pathname } = useRouter();

  return (
    <div className={styles.root}>
      <AppBar position="static" className={styles.appBar} elevation={0}>
        <Toolbar>
          <Link href={"/"}>
            <a className={styles.titleContainer}>
              <Typography variant="h6" className={styles.title}>
                StuySU Applications Site
              </Typography>
            </a>
          </Link>

          <div className={styles.tabs}>
            {pages.map(
              ({ label, icon, active, signedIn, href, adminPrivileges }) => {
                if (signedIn !== null && signedIn !== user.signedIn) {
                  return null;
                }

                if (
                  adminPrivileges !== null &&
                  user.adminPrivileges !== adminPrivileges
                ) {
                  return null;
                }

                return (
                  <Link href={href} key={label}>
                    <a>
                      <Button
                        startIcon={icon}
                        className={styles.tab}
                        color={pathname.match(active) ? "primary" : undefined}
                        children={label}
                      />
                    </a>
                  </Link>
                );
              }
            )}

            {user.signedIn && (
              <Button
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <PowerSettingsNewIcon />
                  )
                }
                className={styles.tab}
                onClick={logout}
              >
                Log out
              </Button>
            )}
          </div>

          <IconButton
            edge="start"
            className={styles.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(open => !open)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

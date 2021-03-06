import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import ReactGA from "react-ga";
import useLogout from "../../utils/hooks/useLogout";
import UserContext from "../auth/UserContext";
import styles from "./NavDrawer.module.css";

export default function NavDrawer({ open, setOpen, pages }) {
  const user = useContext(UserContext);
  const { logout, loading } = useLogout();
  const { pathname } = useRouter();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor="right">
      <div className={styles.container}>
        <div className={styles.heading}>
          {user.signedIn && (
            <>
              <Avatar
                alt={user.name}
                src={user.picture}
                size={80}
                className={styles.avatar}
              />
              <Typography variant="body1">
                Signed in as{" "}
                <Typography variant="inherit" component="span" color="primary">
                  {user.name}
                </Typography>
              </Typography>
              <Typography variant="body1" color="primary">
                ({user.email})
              </Typography>
            </>
          )}

          {!user.signedIn && (
            <Typography variant="body1">Not Signed In</Typography>
          )}
        </div>

        {user.signedIn && (
          <ListItem button onClick={logout} disabled={loading}>
            <ListItemIcon
              children={
                loading ? (
                  <CircularProgress size={16} />
                ) : (
                  <PowerSettingsNewIcon />
                )
              }
            />
            <ListItemText primary={"Log out"} />
          </ListItem>
        )}
        <hr />
        <List>
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
                <Link href={href} key={label} passHref>
                  <ListItem
                    button
                    selected={!!pathname.match(active)}
                    onClick={() => {
                      if (globalThis.window) {
                        ReactGA.event({
                          category: "Interaction",
                          action: "User Clicked Nav Drawer Link: " + label,
                          label: label,
                          nonInteraction: false,
                        });
                      }
                    }}
                  >
                    <ListItemIcon children={icon} />
                    <ListItemText primary={label} />
                  </ListItem>
                </Link>
              );
            }
          )}
        </List>
      </div>
    </Drawer>
  );
}

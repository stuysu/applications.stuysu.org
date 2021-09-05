import { gql, useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { HowToVote } from "@material-ui/icons";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import Head from "next/head";
import Link from "next/link";
import { useContext, useState } from "react";
import LoginButton from "../comps/auth/LoginButton";
import UserContext from "../comps/auth/UserContext";
import DateContext from "../comps/date/DateContext";
import styles from "../styles/Home.module.css";
import getReadableDate from "../utils/date/getReadableDate";
import useLogout from "../utils/hooks/useLogout";

const QUERY = gql`
  query ($page: PositiveInt!) {
    currentApplications(page: $page) {
      page
      numPages
      total

      results {
        id
        title
        url
        color
        deadline
        type
      }
    }
  }
`;

export default function Home() {
  const user = useContext(UserContext);
  const { getNow } = useContext(DateContext);
  const now = getNow();
  const [page, setPage] = useState(1);
  const { logout, loading: loggingOut } = useLogout();
  const { data, loading } = useQuery(QUERY, {
    variables: {
      page,
    },
    skip: !user.signedIn,
  });

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
            <Typography variant={"h4"} align={"center"} gutterBottom>
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
              disabled={loggingOut}
              children={"Log out"}
              startIcon={
                loggingOut ? (
                  <CircularProgress size={16} />
                ) : (
                  <PowerSettingsNew />
                )
              }
              className={styles.logoutButton}
            />

            <Typography variant={"h5"} gutterBottom>
              Current Applications:{" "}
            </Typography>
            <Container maxWidth={"sm"}>
              {!loading && !!data.currentApplications.total && (
                <List>
                  {data.currentApplications.results.map(
                    ({ id, title, url, color, deadline, type }) => (
                      <Link href={"/application/" + url} passHref>
                        <ListItem
                          key={id}
                          style={{
                            border: "1px solid rgba(0, 0, 0, 0.1)",
                            borderLeft: "5px solid " + color,
                            borderRadius: 5,
                            marginBottom: "1rem",
                          }}
                          button
                        >
                          <ListItemIcon style={{ color }}>
                            <HowToVote />
                          </ListItemIcon>
                          <ListItemText
                            primary={title}
                            secondary={
                              <Typography
                                variant={"subtitle2"}
                                component={"span"}
                                color={"textSecondary"}
                              >
                                Deadline: {getReadableDate(deadline, now)}
                                <br />
                                Type:{" "}
                                {type === "hybrid"
                                  ? "Hybrid Anonymity"
                                  : "Full Anonymity"}
                              </Typography>
                            }
                          />
                        </ListItem>
                      </Link>
                    )
                  )}
                </List>
              )}
            </Container>
          </>
        )}
      </main>
    </div>
  );
}

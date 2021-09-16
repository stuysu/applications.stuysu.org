import { gql, useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import HowToVote from "@material-ui/icons/HowToVote";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import Pagination from "@material-ui/lab/Pagination";
import Skeleton from "@material-ui/lab/Skeleton";
import Head from "next/head";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import LoginButton from "../comps/auth/LoginButton";
import UserContext from "../comps/auth/UserContext";
import DateContext from "../comps/date/DateContext";
import styles from "../styles/Home.module.css";
import getReadableDate from "../utils/date/getReadableDate";
import useLogout from "../utils/hooks/useLogout";

const QUERY = gql`
  query ($page: PositiveInt!, $query: String!) {
    currentApplications(query: $query, page: $page, resultsPerPage: 15) {
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
  const [query, setQuery] = useState("");
  const { logout, loading: loggingOut } = useLogout();

  const { data, loading } = useQuery(QUERY, {
    variables: {
      page,
      query,
    },
    skip: !user.signedIn,
  });

  useEffect(() => {
    setPage(1);
  }, [query]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Home | StuySU Applications</title>
        <meta property="og:title" content="Home | StuySU Applications" />
        <meta
          property="og:description"
          content="This site distributes Anonymous IDs used when applying for positions on the StuySU"
        />
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

            <TextField
              variant={"outlined"}
              InputProps={{ startAdornment: <SearchOutlined /> }}
              onChange={e => setQuery(e.target.value)}
              className={styles.search}
              placeholder={"Search for Application"}
            />
            <Container maxWidth={"sm"}>
              {!loading && !!data.currentApplications.total && (
                <List>
                  {data.currentApplications.results.map(
                    ({ id, title, url, color, deadline, type }) => (
                      <Link href={"/application/" + url} passHref key={id}>
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

              {!loading && !data.currentApplications.total && (
                <div>
                  <Typography variant={"h6"} align={"center"} gutterBottom>
                    {query ? "No results" : "No applications at this time"}
                  </Typography>

                  <div className={styles.center}>
                    <img src={"/no-data.svg"} alt={"Empty box"} width={200} />
                  </div>
                </div>
              )}

              {loading && (
                <div>
                  <Skeleton
                    variant="rect"
                    width={379}
                    height={73}
                    className={styles.listItemSkeleton}
                  />
                  <Skeleton
                    variant="rect"
                    width={379}
                    height={73}
                    className={styles.listItemSkeleton}
                  />
                </div>
              )}

              {!loading && !!data.currentApplications.numPages > 1 && (
                <div className={styles.center}>
                  <Pagination
                    page={page}
                    count={data.currentApplications.numPages}
                    onChange={(e, p) => setPage(p)}
                  />
                </div>
              )}
            </Container>
          </>
        )}
      </main>
    </div>
  );
}

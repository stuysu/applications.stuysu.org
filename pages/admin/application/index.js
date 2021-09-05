import { gql, useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { ArchiveRounded, HowToVote, Visibility } from "@material-ui/icons";
import AddOutlined from "@material-ui/icons/AddOutlined";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import DateContext from "../../../comps/date/DateContext";
import styles from "../../../styles/Admin.module.css";
import getReadableDate from "../../../utils/date/getReadableDate";

const QUERY = gql`
  query ($query: String!, $page: PositiveInt!) {
    applications(page: $page, query: $query) {
      total
      numPages
      results {
        id
        title
        url
        color
        deadline
        archived
      }
    }
  }
`;

export default function ApplicationAdmin() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery(QUERY, { variables: { query, page } });
  const { getNow } = useContext(DateContext);
  const now = getNow();

  useEffect(() => {
    setPage(1);
  }, [query, setPage]);

  return (
    <div className={styles.container}>
      <Typography variant={"h4"} align={"center"}>
        Admin Panel
      </Typography>
      <AdminTabBar />

      <Typography variant={"h5"} align={"center"} gutterBottom>
        Applications
      </Typography>

      <div className={styles.center}>
        <Link href={"/admin/application/create"}>
          <a>
            <Button
              startIcon={<AddOutlined />}
              variant={"contained"}
              color={"primary"}
            >
              Create Application
            </Button>
          </a>
        </Link>
      </div>

      <div className={styles.center}>
        <TextField
          label={"Search"}
          InputProps={{
            startAdornment: <SearchOutlined />,
          }}
          value={query}
          onChange={e => setQuery(e.target.value)}
          variant={"outlined"}
          color={"primary"}
          className={styles.searchField}
        />
      </div>

      {loading && (
        <div className={styles.center}>
          <CircularProgress />
        </div>
      )}

      {!loading && !data.applications.total && (
        <div className={styles.textCenter}>
          <Typography paragraph gutterBottom>
            There are no Applications that match your search query
          </Typography>
          <img
            src={"/no-data.svg"}
            alt={"Someone holding an empty box"}
            width={200}
          />
        </div>
      )}

      <Container maxWidth={"sm"}>
        {!loading && !!data.applications.total && (
          <List>
            {data.applications.results.map(
              ({ id, title, url, color, deadline, archived }) => (
                <ListItem
                  key={id}
                  style={{
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    borderLeft: "5px solid " + color,
                    borderRadius: 5,
                    margin: "0.5rem",
                  }}
                >
                  <ListItemIcon style={{ color: archived ? undefined : color }}>
                    {archived ? <ArchiveRounded /> : <HowToVote />}
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
                        {archived && (
                          <>
                            <br />
                            <Typography variant={"inherit"} color={"primary"}>
                              Archived
                            </Typography>
                          </>
                        )}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Link href={"/admin/application/" + id} passHref>
                      <Button
                        color={"primary"}
                        startIcon={<Visibility />}
                        variant={"outlined"}
                      >
                        View
                      </Button>
                    </Link>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            )}
          </List>
        )}
      </Container>
    </div>
  );
}

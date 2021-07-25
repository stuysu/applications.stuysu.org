import { gql, useQuery } from "@apollo/client";
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Edit from "@material-ui/icons/EditOutlined";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import Pagination from "@material-ui/lab/Pagination";
import { Fragment, useState } from "react";
import AdminRequired from "../../../comps/admin/AdminRequired";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import styles from "./../../../styles/Admin.module.css";

const QUERY = gql`
  query ($query: String!, $page: PositiveInt!) {
    users(query: $query, page: $page, resultsPerPage: 10) {
      page
      numPages
      total
      results {
        id
        name
        firstName
        lastName
        email
        picture
      }
    }
  }
`;

export default function UserAdmin() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const { data, loading } = useQuery(QUERY, { variables: { query, page } });

  return (
    <AdminRequired>
      <div className={styles.container}>
        <Typography variant={"h4"} align={"center"}>
          Admin Panel
        </Typography>
        <AdminTabBar />
        <Typography align={"center"} variant={"body1"}>
          You can edit users on this page and add/remove admins. <br />
          If you can't find a certain user, it's likely their account doesn't
          exist. <br />
          Ask them to sign into the site and an account will be created for
          them.
        </Typography>

        <div className={styles.center}>
          <TextField
            className={styles.textField}
            label={"Search"}
            variant={"outlined"}
            InputProps={{
              startAdornment: <SearchOutlined />,
            }}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {loading && (
          <div className={styles.center}>
            <CircularProgress />
          </div>
        )}

        {!!data && !!data.users.results.length && !loading && (
          <div className={styles.center}>
            <List className={styles.userList}>
              {data.users.results.map((user, index) => (
                <Fragment key={user.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={user.name} src={user.picture} />
                    </ListItemAvatar>
                    <ListItemText primary={user.name} secondary={user.email} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="comments">
                        <Edit />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>

                  {data.users.results.length !== index + 1 && <Divider />}
                </Fragment>
              ))}
            </List>
          </div>
        )}

        {!loading && !!data && !data.users.total && (
          <div className={styles.textCenter}>
            <img
              src={"/no-data.svg"}
              alt={"No data icon"}
              className={styles.noResultsVector}
            />

            <Typography variant={"h5"}>No results were found</Typography>
          </div>
        )}

        {data && !loading && (
          <div className={styles.center}>
            <Pagination
              page={page}
              count={data.users.numPages}
              onChange={(e, p) => setPage(p)}
              className={styles.pagination}
            />
          </div>
        )}
      </div>
    </AdminRequired>
  );
}

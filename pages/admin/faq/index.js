import { gql, useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AddOutlined from "@material-ui/icons/AddOutlined";
import DescriptionOutlined from "@material-ui/icons/DescriptionOutlined";
import EditOutlined from "@material-ui/icons/EditOutlined";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import Pagination from "@material-ui/lab/Pagination";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminRequired from "../../../comps/admin/AdminRequired";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import styles from "./../../../styles/Admin.module.css";

const QUERY = gql`
  query ($query: String!, $page: PositiveInt!) {
    faqs(query: $query, page: $page) {
      total
      numPages
      results {
        id
        title
        url
      }
    }
  }
`;

export default function FAQAdmin() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();

  const { data, loading, refetch } = useQuery(QUERY, {
    variables: { query, page },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (router.query.refetch === "true") {
      router.push(router.pathname).then(() => refetch());
    }
  }, [router]);

  return (
    <AdminRequired>
      <div className={styles.container}>
        <Typography variant={"h4"} align={"center"}>
          Admin Panel
        </Typography>
        <AdminTabBar />

        <Typography variant={"h5"} align={"center"} gutterBottom>
          FAQs
        </Typography>

        <div className={styles.center}>
          <Link href={"/admin/faq/create"}>
            <a>
              <Button
                startIcon={<AddOutlined />}
                variant={"contained"}
                color={"primary"}
              >
                Create FAQ
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

        {!loading && !data.faqs.total && (
          <div className={styles.textCenter}>
            <Typography paragraph gutterBottom>
              There are no FAQs that match your search query
            </Typography>
            <img src={"/no-data.svg"} alt={"An empty clipboard"} width={200} />
          </div>
        )}

        {!loading && !!data.faqs.total && (
          <div className={styles.center}>
            <List className={styles.fixedSizeList}>
              {data.faqs.results.map(({ id, title, url }, index) => (
                <>
                  <ListItem key={id}>
                    <ListItemIcon>
                      <DescriptionOutlined />
                    </ListItemIcon>
                    <ListItemText primary={title} secondary={url} />
                    <ListItemSecondaryAction>
                      <Link href={"/admin/faq/" + id}>
                        <Button
                          children={"Edit"}
                          variant="contained"
                          color="primary"
                          startIcon={<EditOutlined />}
                        />
                      </Link>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index + 1 !== data.faqs.results.length && <Divider />}
                </>
              ))}
            </List>
          </div>
        )}

        {!loading && (
          <div className={styles.center}>
            <Pagination
              page={data.faqs?.page}
              count={data.faqs?.numPages}
              onChange={(e, p) => setPage(p)}
              className={styles.pagination}
            />
          </div>
        )}
      </div>
    </AdminRequired>
  );
}

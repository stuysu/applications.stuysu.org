import { gql, useQuery } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import StyledLink from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import DescriptionOutlined from "@material-ui/icons/DescriptionOutlined";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import { Pagination } from "@material-ui/lab";
import Link from "next/link";
import { Fragment, useState } from "react";
import styles from "./../../styles/FAQ.module.css";

const QUERY = gql`
  query ($query: String!, $page: PositiveInt!) {
    faqs(query: $query, page: $page) {
      total
      numPages
      page
      results {
        id
        title
        url
      }
    }
  }
`;

export default function FAQsHome() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery(QUERY, { variables: { query, page } });

  return (
    <div className={styles.container}>
      <Typography variant={"h4"} align={"center"} gutterBottom>
        FAQs
      </Typography>

      <div className={styles.center}>
        <TextField
          value={query}
          onChange={e => setQuery(e.target.value)}
          variant={"outlined"}
          InputProps={{ startAdornment: <SearchOutlined /> }}
          className={styles.textField}
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
          <img
            src={"/no-data.svg"}
            alt={"Someone holding an empty box"}
            width={200}
          />
        </div>
      )}

      {!loading && (
        <div className={styles.center}>
          <List className={styles.fixedSizeContainer}>
            {data?.faqs?.results.map(({ id, url, title }, index) => (
              <Fragment key={id}>
                <Link href={"/faq/" + url} key={id}>
                  <ListItem button>
                    <ListItemIcon>
                      <DescriptionOutlined />
                    </ListItemIcon>
                    <StyledLink>
                      <ListItemText primary={title} />
                    </StyledLink>
                  </ListItem>
                </Link>

                {index + 1 !== data?.faqs?.results.length && <Divider />}
              </Fragment>
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

      <Typography
        variant={"body1"}
        align={"center"}
        className={styles.endMessage}
      >
        Still have questions? Email us at{" "}
        <StyledLink href={"mailto:it@stuysu.org"}>it@stuysu.org</StyledLink>
      </Typography>
    </div>
  );
}

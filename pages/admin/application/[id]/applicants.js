import { gql, useQuery } from "@apollo/client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import { Pagination } from "@material-ui/lab";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import AdminTabBar from "../../../../comps/admin/AdminTabBar";
import BackButton from "../../../../comps/admin/BackButton";
import AdminApplicationTabBar from "../../../../comps/application/AdminApplicationTabBar";
import styles from "./../../../../styles/Admin.module.css";

const QUERY = gql`
  query ($id: ObjectID!) {
    applicationById(id: $id) {
      id
      title
      url
      type
      active
      applicantEmails
      applicants {
        id
        user {
          id
          name
          email
        }
        anonymityId
        status
      }
    }
  }
`;

const AdminHeading = () => (
  <>
    <BackButton href={"/admin/faq"} label={"Back To FAQs"} />

    <Typography variant={"h4"} align={"center"}>
      Admin Panel
    </Typography>
    <AdminTabBar />
  </>
);

export default function ApplicationApplicants() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery(QUERY, { variables: { id }, skip: !id });
  const [delimiter, setDelimiter] = useState(", ");
  const [search, setSearch] = useState("");
  const [applicants, setApplicants] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(1);
  const [resultsPerPage] = useState(15);

  useEffect(() => {
    let apps = data?.applicationById?.applicants;

    if (apps) {
      if (search) {
        const searchWords = Array.from(
          new Set(search.toLowerCase().split(/\s+/))
        );
        apps = apps.filter(a =>
          searchWords.every(
            word =>
              a.user.name.toLowerCase().includes(word) ||
              a.user.email.toLowerCase().includes(word) ||
              a.anonymityId.toLowerCase().includes(word)
          )
        );
      }

      apps.sort((a, b) => {
        if (a.status === "accepted" && b.status !== "accepted") {
          return -1;
        }

        if (b.status === "accepted" && a.status !== "accepted") {
          return 1;
        }

        if (a.status === "rejected" && b.status !== "rejected") {
          return -1;
        }

        if (b.status === "rejected" && a.status !== "rejected") {
          return 1;
        }

        return 0;
      });

      setApplicants(apps);
    }
  }, [data, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  if (loading) {
    return (
      <div className={styles.center}>
        <CircularProgress />
      </div>
    );
  }

  const copyToClipboard = () => {
    globalThis.navigator.clipboard
      .writeText(application.applicantEmails.join(delimiter))
      .then(
        function () {
          enqueueSnackbar("Email addresses copied to clipboard", {
            variant: "success",
          });

          if (globalThis.window) {
            ReactGA.event({
              category: "Interaction",
              action: "Successfully Copied All Emails",
              label: application.title,
              nonInteraction: false,
            });
          }
        },
        function (e) {
          /* clipboard write failed */
          enqueueSnackbar(
            "Unable to copy to clipboard. Please copy manually.",
            {
              variant: "error",
            }
          );

          if (globalThis.window) {
            ReactGA.event({
              category: "Interaction",
              action: "Error Copying Emails",
              label: application.title + " " + e.message,
              nonInteraction: false,
            });
          }
        }
      );
  };

  const application = data?.applicationById;

  if (!application) {
    return (
      <div>
        <AdminHeading />

        <Typography variant={"h5"} align={"center"} paragraph>
          There's no application with that id
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <AdminHeading />

      <Typography
        variant={"h5"}
        color={"secondary"}
        align={"center"}
        gutterBottom
      >
        {application.title}
      </Typography>

      <div className={styles.center}>
        <AdminApplicationTabBar />
      </div>

      {!!application.active && (
        <Typography variant={"body1"} align={"center"} paragraph>
          The results need to be released before this page becomes accessible.
          <br />
          You can do that in the results tab.
        </Typography>
      )}

      {!application.active && (
        <Container maxWidth={"sm"}>
          {application.type === "hybrid" && (
            <div style={{ margin: "1rem 0" }}>
              <TextField
                label={"Email Addresses of All Applicants"}
                value={application.applicantEmails.join(delimiter)}
                variant={"outlined"}
                multiline
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                style={{ margin: "1.5rem 0" }}
              />
              <div>
                <TextField
                  label={"Delimiter"}
                  value={delimiter}
                  variant={"outlined"}
                  onChange={ev => setDelimiter(ev.target.value)}
                  onBlur={ev => ev.target.value === "" && setDelimiter(", ")}
                  style={{ width: 150 }}
                  helperText={"Use a comma for pasting to email clients"}
                />
                &nbsp;
                <Button
                  variant={"outlined"}
                  color={"primary"}
                  style={{ padding: 15 }}
                  onClick={copyToClipboard}
                >
                  Copy Emails
                </Button>
              </div>
            </div>
          )}

          <Typography variant={"h6"} color={"primary"}>
            Applicant Identities
          </Typography>
          <Typography variant={"subtitle1"} color={"textSecondary"}>
            The table below will fill as applicants view their results
          </Typography>

          <TextField
            label={"Search"}
            InputProps={{ startAdornment: <SearchOutlined /> }}
            variant={"outlined"}
            fullWidth
            helperText={"You can search by name, email, or anonymity id"}
            style={{ margin: "1rem 0" }}
            value={search}
            onChange={ev => setSearch(ev.target.value)}
          />

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">Anonymity ID</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applicants &&
                  applicants.map(applicant => (
                    <TableRow
                      key={applicant.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {applicant.user.name}
                      </TableCell>
                      <TableCell align="right">
                        {applicant.user.email}
                      </TableCell>
                      <TableCell align="right">
                        {applicant.anonymityId}
                      </TableCell>
                      <TableCell align="right">{applicant.status}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className={styles.center}>
            <Pagination
              page={page}
              onChange={(_, p) => setPage(p)}
              count={Math.ceil(applicants.length / resultsPerPage)}
              className={styles.pagination}
            />
          </div>
        </Container>
      )}
    </div>
  );
}

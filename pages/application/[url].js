import { gql, useQuery } from "@apollo/client";
import { Tooltip } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import AuthenticationRequired from "../../comps/admin/AuthenticationRequired";
import BackButton from "../../comps/admin/BackButton";
import DeadlineText from "../../comps/application/DeadlineText";
import UserContext from "../../comps/auth/UserContext";
import alertDialog from "../../comps/dialog/alertDialog";
import CleanHTML from "../../comps/ui/CleanHTML";
import clientSHA256 from "../../utils/crypto/clientSHA256";
import styles from "./../../styles/Home.module.css";

const QUERY = gql`
  query ($url: NonEmptyString!) {
    applicationByUrl(url: $url) {
      id
      title

      url
      link
      embed
      type
      color
      more
      active
      archived

      deadline
      createdAt
      updatedAt
    }
  }
`;
export default function ApplicationPage() {
  const router = useRouter();
  const { url } = router.query;
  const user = useContext(UserContext);
  const [anonymityId, setAnonymityId] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const { data, loading } = useQuery(QUERY, {
    variables: { url },
    skip: !user.signedIn,
  });

  const application = data?.applicationByUrl;

  const showHowToCalculate = async () => {
    const hash = await clientSHA256(application.id + user.anonymitySecret);
    await alertDialog({
      title: (
        <>
          Calculating your anonymity ID for:{" "}
          <Typography variant={"inherit"} color={"primary"}>
            {application.title}
          </Typography>
        </>
      ),
      body: (
        <>
          <Typography variant={"body1"} gutterBottom>
            The ID of this application is:{" "}
            <Typography
              variant={"inherit"}
              color={"primary"}
              component={"span"}
              className={styles.miniText}
            >
              {application.id}
            </Typography>
          </Typography>

          <Typography variant={"body1"} gutterBottom>
            Your Anonymity Secret is:{" "}
            <Typography
              variant={"inherit"}
              color={"secondary"}
              component={"span"}
              className={styles.miniText}
            >
              {user.anonymitySecret}
            </Typography>
          </Typography>

          <br />
          <Typography variant={"subtitle1"} gutterBottom>
            Steps:
          </Typography>

          <ol className={styles.steps}>
            <li>
              <Typography
                variant={"subtitle1"}
                paragraph
                color={"textSecondary"}
              >
                Concatenate the application id and your anonymity secret.
                <br />
                (application id + anonymity secret)
              </Typography>

              <div>
                <Typography
                  variant={"subtitle2"}
                  color={"primary"}
                  className={styles.miniText}
                  component={"span"}
                >
                  {application.id}
                </Typography>
                <Typography
                  variant={"subtitle2"}
                  color={"secondary"}
                  className={styles.miniText}
                  component={"span"}
                >
                  {user.anonymitySecret}
                </Typography>
              </div>
            </li>

            <li>
              <Typography
                variant={"subtitle1"}
                paragraph
                color={"textSecondary"}
              >
                Hash that value using the <b>SHA256</b> Algorithm
              </Typography>
              <Typography
                variant={"subtitle2"}
                className={styles.miniText}
                style={{ color: "#6c5ce7" }}
                paragraph
              >
                {hash}
              </Typography>
            </li>
            <li>
              <Typography
                variant={"subtitle1"}
                paragraph
                color={"textSecondary"}
              >
                Truncate the hash to the <b>first 8 characters</b> for
                simplicity.
              </Typography>
            </li>
            <li>
              <Typography
                variant={"subtitle1"}
                color={"textSecondary"}
                gutterBottom
              >
                Your anonymity ID for this application is therefore:{" "}
              </Typography>
              <Typography variant={"subtitle1"}>
                <b className={styles.idCodeBox}>{anonymityId}</b>
              </Typography>
            </li>
          </ol>
        </>
      ),
    });
  };

  useEffect(() => {
    if (application && user.signedIn) {
      clientSHA256(application.id + user.anonymitySecret)
        .then(hash => setAnonymityId(hash.substr(0, 8).toUpperCase()))
        .catch(() =>
          enqueueSnackbar(
            "There was an issue calculating your anonymity id. Try another browser or device.",
            {
              variant: "error",
            }
          )
        );
    }
  }, [data]);

  const copyToClipboard = () => {
    globalThis.navigator.clipboard.writeText(anonymityId).then(
      function () {
        enqueueSnackbar("Anonymity ID copied to clipboard.", {
          variant: "success",
        });
      },
      function () {
        /* clipboard write failed */
        enqueueSnackbar("Unable to copy to clipboard. Please copy manually.", {
          variant: "error",
        });
      }
    );
  };

  if (loading || !data) {
    return (
      <AuthenticationRequired>
        <div className={styles.center}>
          <CircularProgress />
        </div>
      </AuthenticationRequired>
    );
  }

  return (
    <div className={styles.page}>
      <BackButton href={"/"} label={"Back To Home"} />
      <Head>
        <title>{application.title} | StuySU Applications</title>
      </Head>

      <Tooltip title={application.id}>
        <Typography variant={"h4"} align={"center"} gutterBottom>
          {application.title}
        </Typography>
      </Tooltip>
      <hr className={styles.hr} style={{ background: application.color }} />
      <Typography
        variant={"body1"}
        color={"textSecondary"}
        align={"center"}
        paragraph
      >
        Type:{" "}
        <b style={{ color: "#27ae60" }}>
          {application.type === "hybrid"
            ? "Hybrid Anonymity"
            : "Fully Anonymous"}{" "}
        </b>
        (
        <Typography
          variant={"body2"}
          component={"span"}
          color={"textSecondary"}
          align={"center"}
          paragraph
        >
          <Link
            href={"/faq/what-are-anonymity-types"}
            color={"textSecondary"}
            target={"_blank"}
            referrerPolicy={"no-referrer"}
          >
            What does this mean?
          </Link>
        </Typography>
        )
      </Typography>

      <Typography
        variant={"body1"}
        color={"textSecondary"}
        align={"center"}
        paragraph
      >
        Status:{" "}
        {application.active && !application.archived ? (
          <Typography variant={"inherit"} style={{ color: "#27ae60" }}>
            Open / Results Not Announced
          </Typography>
        ) : (
          <Typography variant={"inherit"}>
            {application.archived
              ? "Completed / Archived"
              : "Completed / Results Announced"}
          </Typography>
        )}
      </Typography>

      <Typography
        variant={"body1"}
        color={"textSecondary"}
        align={"center"}
        paragraph
      >
        Deadline:{" "}
        <DeadlineText
          showWarning
          warningDiff={1000 * 60 * 60 * 6}
          deadline={application.deadline}
        />
      </Typography>

      {!!application.link && (
        <Typography
          variant={"body1"}
          align={"center"}
          color={"textSecondary"}
          paragraph
        >
          Application Form:{" "}
          <Link
            href={application.link}
            target={"_blank"}
            referrerPolicy={"no-referrer"}
            color={"secondary"}
          >
            {application.link.length > 60
              ? "https://applications.stuysu.org/form/" + application.url
              : application.link}
          </Link>
        </Typography>
      )}

      {application.more && (
        <Container maxWidth={"md"} className={styles.html}>
          <CleanHTML html={application.more} />
        </Container>
      )}

      <div className={styles.idContainer}>
        <div className={styles.center}>
          <TextField
            value={anonymityId || "loading..."}
            variant={"outlined"}
            label={"Your Anonymity ID"}
            color={"secondary"}
            InputProps={{
              readOnly: true,
              notched: true,
            }}
          />
          &nbsp;
          <Button
            variant={"outlined"}
            onClick={copyToClipboard}
            color={"secondary"}
          >
            Copy
          </Button>
        </div>
        <br />

        <Typography
          align={"center"}
          variant={"subtitle2"}
          color={"textSecondary"}
          paragraph
        >
          <Link
            href={"#"}
            color={"textSecondary"}
            onClick={() => {
              showHowToCalculate();
              return false;
            }}
          >
            (How was this ID generated?)
          </Link>
        </Typography>
        <Typography
          variant={"body1"}
          align={"center"}
          color={"error"}
          paragraph
          gutterBottom
        >
          <b>
            This ID is unique to this application, <br />
            Do not use it for any other applications!
          </b>
        </Typography>
      </div>

      {application.embed && (
        <Container maxWidth={"md"} className={styles.iframeContainer}>
          <Button
            variant={"outlined"}
            startIcon={<ExitToApp />}
            href={application.link}
            target={"_blank"}
            referrerPolicy={"no-referrer"}
          >
            Open In A New Tab
          </Button>

          <iframe
            src={
              "/form/" +
              application.url +
              "?noNavigation=true&jwt=" +
              globalThis.encodeURIComponent(localStorage.getItem("jwt"))
            }
            className={styles.iframe}
          />
        </Container>
      )}
    </div>
  );
}

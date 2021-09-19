import { gql, useMutation, useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import capitalize from "@material-ui/core/utils/capitalize";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useContext, useEffect, useRef, useState } from "react";
import ReactGA from "react-ga";
import AuthenticationRequired from "../../comps/admin/AuthenticationRequired";
import BackButton from "../../comps/admin/BackButton";
import DeadlineText from "../../comps/application/DeadlineText";
import IDGenerationExplanation from "../../comps/application/IDGenerationExplanation";
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

      authenticatedApplicant {
        id
        status
        message
      }
    }
  }
`;

const RECORD_EMAIL_MUTATION = gql`
  mutation ($id: ObjectID!) {
    recordApplicantEmailByApplicationId(id: $id)
  }
`;

const RECORD_ID_MUTATION = gql`
  mutation ($id: ObjectID!, $anonymityId: AnonymityID!) {
    recordAnonymityIdByApplicationId(anonymityId: $anonymityId, id: $id) {
      id
    }
  }
`;

const selectNodeBody = node => {
  if (globalThis.window) {
    ReactGA.event({
      category: "Interaction",
      action: "ID Selection",
      label: "User Clicked on their ID and selected the text",
      nonInteraction: false,
    });
  }

  const document = globalThis.document;

  if (document.body.createTextRange) {
    const range = document.body.createTextRange();
    range.moveToElementText(node);
    range.select();
  } else if (window.getSelection) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    console.warn("Could not select text in node: Unsupported browser.");
  }
};

export default function ApplicationPage() {
  const router = useRouter();
  const { url } = router.query;
  const user = useContext(UserContext);
  const [anonymityId, setAnonymityId] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [recordUserEmail] = useMutation(RECORD_EMAIL_MUTATION);
  const { data, loading, refetch } = useQuery(QUERY, {
    variables: { url },
    skip: !user.signedIn || !url,
  });

  const [recordId, { loading: recordingId }] = useMutation(RECORD_ID_MUTATION);

  const idContainerRef = useRef(null);

  useEffect(() => {
    if (data?.applicationByUrl?.type === "hybrid") {
      recordUserEmail({ variables: { id: data.applicationByUrl.id } });
    }
  }, [data]);

  const application = data?.applicationByUrl;

  const handleIdRecord = async () => {
    try {
      await recordId({
        variables: { id: application.id, anonymityId: anonymityId },
      });

      await refetch();
    } catch (e) {
      enqueueSnackbar(e.message, { variant: "error" });
    }
  };

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
        <IDGenerationExplanation
          hash={hash}
          applicationId={application.id}
          anonymitySecret={user.anonymitySecret}
          anonymityId={anonymityId}
        />
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

        if (globalThis.window) {
          ReactGA.event({
            category: "Interaction",
            action: "Successfully Copied Anonymity ID",
            label: application.title,
            nonInteraction: false,
          });
        }
      },
      function (e) {
        /* clipboard write failed */
        enqueueSnackbar("Unable to copy to clipboard. Please copy manually.", {
          variant: "error",
        });

        if (globalThis.window) {
          ReactGA.event({
            category: "Interaction",
            action: "Error Copying Anonymity ID",
            label: application.title + " " + e.message,
            nonInteraction: false,
          });
        }
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

  const applicant = application.authenticatedApplicant;

  return (
    <div className={styles.page}>
      <BackButton href={"/"} label={"Back To Home"} />
      <Head>
        <title>{application.title} | StuySU Applications</title>
      </Head>

      <Tooltip title={application.id}>
        <Typography
          variant={"h4"}
          align={"center"}
          gutterBottom
          style={{ padding: "0 1rem" }}
        >
          {application.title}
        </Typography>
      </Tooltip>
      <hr className={styles.hr} style={{ background: application.color }} />
      <Container maxWidth={"xs"}>
        <Typography variant={"body1"} color={"textSecondary"} paragraph>
          Type:{" "}
          <b style={{ color: "#27ae60" }}>
            {application.type === "hybrid"
              ? "Hybrid Anonymity"
              : "Fully Anonymous"}
          </b>{" "}
          (
          <Typography
            variant={"body2"}
            component={"span"}
            color={"textSecondary"}
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

        <Typography variant={"body1"} color={"textSecondary"} paragraph>
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

        <Typography variant={"body1"} color={"textSecondary"} paragraph>
          Deadline:{" "}
          <DeadlineText
            showWarning
            warningDiff={1000 * 60 * 60 * 6}
            deadline={application.deadline}
          />
        </Typography>

        {!!application.link && (
          <Typography variant={"body1"} color={"textSecondary"} paragraph>
            Application Form:{" "}
            <Link
              href={application.link}
              target={"_blank"}
              referrerPolicy={"no-referrer"}
              color={"secondary"}
              onClick={() => {
                if (globalThis.window) {
                  ReactGA.event({
                    category: "Interaction",
                    action: "User Clicked Application Form Link",
                    label: application.title,
                    nonInteraction: false,
                  });
                }
              }}
            >
              {application.link.length > 60
                ? "https://applications.stuysu.org/form/" + application.url
                : application.link}
            </Link>
          </Typography>
        )}
      </Container>

      {!application.active && (
        <Container maxWidth={"md"}>
          <div
            style={{
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderRadius: 5,
              padding: "1rem",
            }}
          >
            <Typography
              variant={"h5"}
              align={"center"}
              color={"primary"}
              paragraph
            >
              Results:
            </Typography>

            {!!applicant && (
              <>
                <Typography variant={"body1"} align={"center"}>
                  Status:{" "}
                  <Typography
                    variant={"inherit"}
                    component={"span"}
                    style={{
                      color:
                        applicant.status === "accepted"
                          ? "rgb(39, 174, 96)"
                          : "textSecondary",
                    }}
                  >
                    {capitalize(application.authenticatedApplicant.status)}
                  </Typography>
                </Typography>
                <CleanHTML html={applicant.message} style={{ border: 0 }} />
              </>
            )}

            {!applicant && (
              <>
                <Typography variant={"body1"} align={"center"} paragraph>
                  In order to view your results you must share your Anonymity ID
                  for this application. <br />
                  It will be sent to and stored on the server alongside your
                  identity to be used by members of the SU to reach out to you.
                </Typography>

                <div className={styles.center}>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    disabled={recordingId}
                    onClick={handleIdRecord}
                  >
                    View My Results
                  </Button>
                </div>
              </>
            )}
          </div>
        </Container>
      )}

      {application.more && (
        <Container maxWidth={"md"} className={styles.html}>
          <CleanHTML html={application.more} />
        </Container>
      )}

      <div className={styles.center}>
        <fieldset
          className={styles.idFieldset}
          onClick={() => {
            if (idContainerRef.current) {
              selectNodeBody(idContainerRef.current);
            }
          }}
        >
          <legend color={"red"}>Your Anonymity ID:</legend>
          <div className={styles.idContainer} ref={idContainerRef}>
            {anonymityId.split("").map((char, index) => {
              const isInt = /[0-9]/.test(char);
              return (
                <Typography
                  variant={"inherit"}
                  color={isInt ? "error" : undefined}
                  className={styles.idInput}
                  component={"span"}
                  key={index}
                >
                  {char}
                </Typography>
              );
            })}
          </div>
        </fieldset>
        &nbsp;
        <Button
          variant={"outlined"}
          onClick={copyToClipboard}
          color={"secondary"}
          className={styles.copyButton}
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
        If your ID has{" "}
        <Typography
          align={"center"}
          variant={"inherit"}
          color={"error"}
          component={"span"}
          paragraph
        >
          <b>Red</b>
        </Typography>{" "}
        characters, they are numbers
      </Typography>
      <Typography
        variant={"body1"}
        align={"center"}
        color={"error"}
        paragraph
        gutterBottom
      >
        <b>
          This ID is unique to{" "}
          <Typography
            variant={"inherit"}
            color={"secondary"}
            component={"span"}
          >
            {application.title}
          </Typography>
          , <br />
          Do not use it for any other applications!
        </b>
      </Typography>

      <Typography
        align={"center"}
        variant={"subtitle1"}
        color={"textSecondary"}
        paragraph
      >
        <Link
          href={"#"}
          color={"secondary"}
          onClick={() => {
            if (globalThis.window) {
              ReactGA.event({
                category: "Interaction",
                action: "Clicked How ID Was Generated Link",
                label: application.title,
                nonInteraction: false,
              });
            }

            showHowToCalculate();
            return false;
          }}
        >
          (How was this ID generated?)
        </Link>
      </Typography>

      {application.active && application.embed && (
        <Container maxWidth={"md"} className={styles.iframeContainer}>
          <Button
            variant={"outlined"}
            startIcon={<ExitToApp />}
            href={application.link}
            target={"_blank"}
            referrerPolicy={"no-referrer"}
            onClick={() => {
              if (globalThis.window) {
                ReactGA.event({
                  category: "Interaction",
                  action: "User Clicked Open In New Tab Button",
                  label: application.title,
                  nonInteraction: false,
                });
              }
            }}
          >
            Open In A New Tab
          </Button>

          <iframe
            src={
              "/form/" +
              application.url +
              "?noNavigation=true&noFooter=true&&embed=true&jwt=" +
              globalThis.encodeURIComponent(localStorage.getItem("jwt"))
            }
            className={styles.iframe}
          />
        </Container>
      )}
    </div>
  );
}

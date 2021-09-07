import Typography from "@material-ui/core/Typography";
import styles from "../../styles/Home.module.css";

export default function IDGenerationExplanation({
  hash,
  applicationId,
  anonymitySecret,
  anonymityId,
}) {
  return (
    <>
      <Typography variant={"body1"} gutterBottom>
        The ID of this application is:{" "}
        <Typography
          variant={"inherit"}
          color={"primary"}
          component={"span"}
          className={styles.longText}
        >
          {applicationId}
        </Typography>
      </Typography>

      <Typography variant={"body1"} gutterBottom>
        Your Anonymity Secret is:{" "}
        <Typography
          variant={"inherit"}
          color={"secondary"}
          component={"span"}
          className={styles.longText}
        >
          {anonymitySecret}
        </Typography>
      </Typography>

      <br />
      <Typography variant={"subtitle1"} gutterBottom>
        Steps:
      </Typography>

      <ol className={styles.steps}>
        <li>
          <Typography variant={"subtitle1"} paragraph color={"textSecondary"}>
            Concatenate the application id and your anonymity secret.
            <br />
            (application id + anonymity secret)
          </Typography>

          <div>
            <Typography
              variant={"subtitle2"}
              color={"primary"}
              className={styles.longText}
              component={"span"}
            >
              {applicationId}
            </Typography>
            <Typography
              variant={"subtitle2"}
              color={"secondary"}
              className={styles.longText}
              component={"span"}
            >
              {anonymitySecret}
            </Typography>
          </div>
        </li>

        <li>
          <Typography variant={"subtitle1"} paragraph color={"textSecondary"}>
            Hash that value using the <b>SHA256</b> Algorithm
          </Typography>
          <Typography
            variant={"subtitle2"}
            className={styles.longText}
            style={{ color: "#6c5ce7" }}
            paragraph
          >
            {hash}
          </Typography>
        </li>
        <li>
          <Typography variant={"subtitle1"} paragraph color={"textSecondary"}>
            Truncate the hash to the <b>first 8 characters</b> for simplicity.
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
  );
}

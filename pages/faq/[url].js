import { gql, useQuery } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import StyledLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import BackButton from "../../comps/admin/BackButton";
import styles from "./../../styles/FAQ.module.css";

const QUERY = gql`
  query ($url: NonEmptyString!) {
    faqByUrl(url: $url) {
      id
      title
      url
      body
      updatedAt
    }
  }
`;

export default function FAQPreview() {
  const router = useRouter();
  const { url } = router.query;
  const { data, loading } = useQuery(QUERY, { variables: { url } });

  const faq = data?.faqByUrl;

  if (loading) {
    return (
      <div className={styles.container}>
        <BackButton label={"Back To All FAQs"} href={"/faq"} />

        <Typography variant={"h4"} align={"center"} gutterBottom>
          FAQs
        </Typography>

        <div className={styles.center}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (!faq) {
    return (
      <div className={styles.container}>
        <BackButton label={"Back To All FAQs"} href={"/faq"} />

        <Typography variant={"h4"} align={"center"} gutterBottom>
          FAQs
        </Typography>

        <Typography
          variant={"h5"}
          align={"center"}
          color={"primary"}
          gutterBottom
          className={styles.title}
        >
          There's no FAQ with that url
        </Typography>

        <div className={styles.center}>
          <img src={"/no-data.svg"} alt={"An empty clipboard"} width={200} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <BackButton label={"Back To All FAQs"} href={"/faq"} />

      <Typography variant={"h4"} align={"center"} gutterBottom>
        FAQs
      </Typography>

      <Typography
        variant={"h5"}
        align={"center"}
        color={"primary"}
        gutterBottom
        className={styles.title}
      >
        <b>{faq.title}</b>
      </Typography>

      <div className={styles.center}>
        <div className={styles.fixedSizeContainer}>
          <hr className={styles.hr} />

          <div
            className={"sanitized-html"}
            dangerouslySetInnerHTML={{ __html: faq?.body }}
          />
        </div>
      </div>

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

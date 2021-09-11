import { gql, useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import StyledLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import EditOutlined from "@material-ui/icons/EditOutlined";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import BackButton from "../../comps/admin/BackButton";
import UserContext from "../../comps/auth/UserContext";
import CleanHTML from "../../comps/ui/CleanHTML";
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
  const user = useContext(UserContext);

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
          <img
            src={"/no-data.svg"}
            alt={"Someone holding an empty box"}
            width={200}
          />
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

      {user.signedIn && user.adminPrivileges && (
        <div className={styles.center}>
          <Link href={"/admin/faq/" + faq.id}>
            <Button
              startIcon={<EditOutlined />}
              variant={"outlined"}
              color={"secondary"}
            >
              Edit This FAQ
            </Button>
          </Link>
        </div>
      )}

      <div className={styles.center}>
        <div className={styles.fixedSizeContainer}>
          <hr className={styles.hr} />

          <CleanHTML html={faq?.body} style={{ border: 0 }} />
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

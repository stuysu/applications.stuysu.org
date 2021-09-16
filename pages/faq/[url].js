import Button from "@material-ui/core/Button";
import StyledLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import EditOutlined from "@material-ui/icons/EditOutlined";
import Head from "next/head";
import Link from "next/link";
import { useContext } from "react";
import BackButton from "../../comps/admin/BackButton";
import UserContext from "../../comps/auth/UserContext";
import CleanHTML from "../../comps/ui/CleanHTML";
import FAQ from "../../models/faq";
import styles from "./../../styles/FAQ.module.css";

export async function getStaticProps(ctx) {
  const { url } = ctx.params;
  const faq = await FAQ.findOne({ url });

  if (!faq) {
    return {
      notFound: true,
    };
  }

  const { title, body, plainTextBody } = faq;

  return {
    props: {
      faq: {
        title,
        url,
        body,
        plainTextBody: plainTextBody || "FAQ: " + title,
      },
    },
    revalidate: 30,
  };
}

export async function getStaticPaths() {
  const faqs = await FAQ.find({});

  const paths = faqs.map(({ url }) => ({ params: { url } }));

  return {
    paths,
    fallback: true,
  };
}

export default function FAQPreview({ faq }) {
  const user = useContext(UserContext);

  const bodyWords = faq.plainTextBody.split(" ");
  const summaryWords = bodyWords.slice(0, 20);

  let description = summaryWords.join(" ");

  if (summaryWords.length < bodyWords.length) {
    description += "...";
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{faq.title} | StuySU Applications</title>
        <meta
          property="og:title"
          content={faq.title + " | StuySU Applications"}
        />
        <meta property="og:description" content={description} />
      </Head>
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

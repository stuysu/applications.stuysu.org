import { gql, useMutation } from "@apollo/client";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ArrowBackIosOutlined from "@material-ui/icons/ArrowBackIosOutlined";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import ReactGA from "react-ga";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import FAQForm from "../../../comps/faq/FAQForm";
import styles from "../../../styles/Admin.module.css";

const MUTATION = gql`
  mutation (
    $title: NonEmptyString!
    $url: NonEmptyString!
    $body: NonEmptyString!
  ) {
    createFAQ(title: $title, url: $url, body: $body) {
      id
    }
  }
`;

export default function CreateFAQ() {
  const [create, { loading }] = useMutation(MUTATION);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const onSubmit = async (values, { setSubmitting }) => {
    if (globalThis.window) {
      ReactGA.event({
        category: "Interaction",
        action: "Attempted FAQ Creation",
        label: window.location.pathname,
        nonInteraction: false,
      });
    }

    try {
      const { data } = await create({
        variables: values,
      });

      const id = data.createFAQ.id;
      await router.push("/admin/faq/" + id);
    } catch (e) {
      enqueueSnackbar(e.message, { variant: "error" });
      setSubmitting(false);

      if (globalThis.window) {
        ReactGA.event({
          category: "Interaction",
          action: "Errored FAQ Creation",
          label: window.location.pathname,
          nonInteraction: false,
        });
      }
    }
  };

  return (
    <div className={styles.container}>
      <Typography variant={"h4"} align={"center"}>
        Admin Panel
      </Typography>
      <AdminTabBar />

      <div className={styles.center}>
        <div className={styles.tabBarWidthContainer}>
          <Link href={"/admin/faq"}>
            <a>
              <Button
                variant={"outlined"}
                color={"primary"}
                startIcon={<ArrowBackIosOutlined />}
              >
                Back To FAQs
              </Button>
            </a>
          </Link>
        </div>
      </div>

      <Typography variant={"h5"} align={"center"} gutterBottom>
        Create FAQ
      </Typography>

      <div className={styles.center}>
        <FAQForm
          onSubmit={onSubmit}
          submitLabel={"Create"}
          disabled={loading}
        />
      </div>
    </div>
  );
}

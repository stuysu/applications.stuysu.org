import { gql, useMutation } from "@apollo/client";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import BackButton from "../../../comps/admin/BackButton";
import ApplicationForm from "../../../comps/application/ApplicationForm";
import styles from "./../../../styles/Admin.module.css";

const MUTATION = gql`
  mutation (
    $title: NonEmptyString!
    $url: NonEmptyString!
    $link: String!
    $embed: Boolean!
    $type: AnonymityType!
    $deadline: DateTime!
    $color: HexColorCode!
    $more: String!
  ) {
    createApplication(
      title: $title
      url: $url
      link: $link
      embed: $embed
      type: $type
      deadline: $deadline
      color: $color
      more: $more
    ) {
      id
    }
  }
`;

export default function CreateApplication() {
  const [create, { loading }] = useMutation(MUTATION);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { title, url, link, embed, type, deadline, color, more } = values;

      const { data } = await create({
        variables: {
          title,
          url,
          link,
          embed,
          type,
          deadline,
          color,
          more,
        },
      });

      await router.push("/admin/application/" + data.createApplication.id);
    } catch (e) {
      enqueueSnackbar(e.message, { variant: "error" });
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <BackButton label={"Back To Applications"} href={"/admin/application"} />
      <Typography variant={"h4"} align={"center"}>
        Admin Panel
      </Typography>
      <AdminTabBar />

      <Typography variant={"h5"} align={"center"}>
        Create Application
      </Typography>

      <div className={styles.center}>
        <ApplicationForm
          submitLabel={"Create"}
          disabled={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

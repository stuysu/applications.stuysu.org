import { gql, useMutation, useQuery } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState } from "react";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import BackButton from "../../../comps/admin/BackButton";
import ApplicationForm from "../../../comps/application/ApplicationForm";
import styles from "./../../../styles/Admin.module.css";

const QUERY = gql`
  query ($id: ObjectID!) {
    applicationById(id: $id) {
      id
      title
      url
      link
      embed
      type
      deadline
      color
      more
      active
      archived
      updatedAt
      createdAt
    }
  }
`;

const MUTATION = gql`
  mutation (
    $id: ObjectID!
    $title: NonEmptyString!
    $url: NonEmptyString!
    $link: String!
    $embed: Boolean!
    $type: AnonymityType!
    $deadline: DateTime!
    $color: HexColorCode!
    $more: String!
    $archived: Boolean!
    $active: Boolean!
  ) {
    editApplication(
      id: $id
      title: $title
      url: $url
      link: $link
      embed: $embed
      type: $type
      deadline: $deadline
      color: $color
      more: $more
      active: $active
      archived: $archived
    ) {
      id
      title
      url
      link
      embed
      type
      deadline
      color
      more
      active
      archived
      updatedAt
      createdAt
    }
  }
`;

export default function CreateApplication() {
  const [edit, { loading: saving }] = useMutation(MUTATION);
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useQuery(QUERY, { variables: { id }, skip: !id });
  const [editing, setEditing] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  if (loading) {
    return (
      <div className={styles.center}>
        <CircularProgress />
      </div>
    );
  }

  const application = data?.applicationById;

  if (!loading && !application) {
    return (
      <div className={styles.container}>
        <BackButton
          label={"Back To Applications"}
          href={"/admin/application"}
        />

        <Typography variant={"h4"} align={"center"}>
          Admin Panel
        </Typography>
        <AdminTabBar />

        <Typography variant={"h5"} align={"center"}>
          There's no Application with that ID
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Typography variant={"h4"} align={"center"}>
        Admin Panel
      </Typography>
      <AdminTabBar />

      <Typography variant={"h5"} align={"center"}>
        {application.title}
      </Typography>

      <div className={styles.center}>
        <ApplicationForm
          submitLabel={"Save"}
          disabled={loading || saving || !editing}
          initialValues={application}
        />
      </div>
    </div>
  );
}

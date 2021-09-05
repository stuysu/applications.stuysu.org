import { gql, useQuery } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import AdminTabBar from "../../../../comps/admin/AdminTabBar";
import BackButton from "../../../../comps/admin/BackButton";
import ApplicationTabBar from "../../../../comps/application/ApplicationTabBar";
import { ObjectIdRegex } from "../../../../constants";
import styles from "./../../../../styles/Admin.module.css";

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

export default function AdminApplicationResults() {
  const router = useRouter();

  const { id } = router.query || "";
  const idIsValid = ObjectIdRegex.test(id);

  const { data, loading, refetch } = useQuery(QUERY, {
    variables: { id },
    skip: !idIsValid,
  });

  const application = data?.applicationById;

  if (loading) {
    return (
      <div className={styles.center}>
        <CircularProgress />
      </div>
    );
  }

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
      <BackButton label={"Back To Applications"} href={"/admin/application"} />
      <Typography variant={"h4"} align={"center"}>
        Admin Panel
      </Typography>
      <AdminTabBar />
      <Typography
        variant={"h5"}
        align={"center"}
        gutterBottom
        color={"secondary"}
      >
        {application.title}
      </Typography>
      <div className={styles.center}>
        <ApplicationTabBar />
      </div>
      <Typography variant={"body1"} align={"center"}>
        {application.active
          ? "This application is still active"
          : "This application has been closed."}
      </Typography>
    </div>
  );
}

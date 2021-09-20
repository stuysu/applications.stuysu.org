import { gql, useMutation, useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Check from "@material-ui/icons/Check";
import EditOutlined from "@material-ui/icons/EditOutlined";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useContext, useState } from "react";
import AdminTabBar from "../../../../comps/admin/AdminTabBar";
import BackButton from "../../../../comps/admin/BackButton";
import client from "../../../../comps/apollo/client";
import AdminApplicationResultsForm from "../../../../comps/application/AdminApplicationResultsForm";
import AdminApplicationTabBar from "../../../../comps/application/AdminApplicationTabBar";
import DateContext from "../../../../comps/date/DateContext";
import confirmDialog from "../../../../comps/dialog/confirmDialog";
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

      results {
        acceptedIds
        acceptanceMessage
        rejectedIds
        rejectionMessage
      }
    }
  }
`;

const SAVE_RESULTS_MUTATION = gql`
  mutation (
    $id: ObjectID!
    $acceptanceMessage: String!
    $rejectionMessage: String!
    $acceptedIds: [AnonymityID!]!
    $rejectedIds: [AnonymityID!]!
  ) {
    editResultsByApplicationId(
      id: $id
      acceptedIds: $acceptedIds
      acceptanceMessage: $acceptanceMessage
      rejectedIds: $rejectedIds
      rejectionMessage: $rejectionMessage
    ) {
      acceptedIds
    }
  }
`;

const RELEASE_RESULTS_MUTATION = gql`
  mutation ($id: ObjectID!) {
    releaseResultsByApplicationId(id: $id) {
      id
      active
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

  const [releaseResults, { loading: settingActive }] = useMutation(
    RELEASE_RESULTS_MUTATION,
    {
      variables: { id },
    }
  );

  const { getNow } = useContext(DateContext);

  const handleReleaseResults = async () => {
    let confirmation = await confirmDialog({
      title: "Confirm Releasing Results",
      body: "Are you sure you want to release results? This action cannot be undone",
    });

    const now = getNow();
    const deadline = new Date(application.deadline);
    if (confirmation && now < deadline) {
      confirmation = await confirmDialog({
        title: "Are you really sure?",
        body: "It looks like this application's deadline still hasn't passed yet. Are you really sure you want to release results?",
      });
    }

    if (confirmation) {
      try {
        await releaseResults();
        await client.cache.reset();
        await refetch();
      } catch (e) {
        enqueueSnackbar(e.message, { variant: "error" });
      }
    }
  };

  const { enqueueSnackbar } = useSnackbar();

  const [edit, { loading: isEditing }] = useMutation(SAVE_RESULTS_MUTATION);
  const [editing, setEditing] = useState(false);

  const application = data?.applicationById;

  const handleSubmit = async (values, { setSubmitting }) => {
    const { acceptedIds, acceptanceMessage, rejectedIds, rejectionMessage } =
      values;

    try {
      await edit({
        variables: {
          id,
          acceptedIds,
          acceptanceMessage,
          rejectedIds,
          rejectionMessage,
        },
      });

      setEditing(false);
      enqueueSnackbar("Your changes were saved successfully", {
        variant: "success",
      });
    } catch (e) {
      enqueueSnackbar("Error: " + e.message, { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

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
        <AdminApplicationTabBar />
      </div>

      <Container maxWidth={"sm"}>
        {!editing && (
          <div className={styles.center}>
            <Button
              variant={"contained"}
              color={"primary"}
              startIcon={<EditOutlined />}
              onClick={() => setEditing(true)}
              className={styles.editButton}
            >
              Edit
            </Button>

            <Button
              variant={"outlined"}
              color={"secondary"}
              disabled={!application.active || settingActive}
              startIcon={<Check />}
              onClick={handleReleaseResults}
              className={styles.editButton}
            >
              {application.active
                ? "Release Results"
                : "Results have been released"}
            </Button>
          </div>
        )}

        <AdminApplicationResultsForm
          submitLabel={"Save"}
          showCancelButton
          initialValues={application.results}
          onSubmit={handleSubmit}
          disabled={!editing || isEditing}
          onCancel={({ resetForm }) => {
            resetForm();
            setEditing(false);
          }}
        />
      </Container>
    </div>
  );
}

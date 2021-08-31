import { gql, useMutation, useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { ArchiveOutlined, RestoreOutlined } from "@material-ui/icons";
import EditOutlined from "@material-ui/icons/EditOutlined";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState } from "react";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import BackButton from "../../../comps/admin/BackButton";
import ApplicationForm from "../../../comps/application/ApplicationForm";
import confirmDialog from "../../../comps/dialog/confirmDialog";
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
  const { data, loading, refetch } = useQuery(QUERY, {
    variables: { id },
    skip: !id,
  });
  const [editing, setEditing] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const archive = async () => {
    const confirmation = await confirmDialog({
      title: "Confirm Archiving",
      body: "Are you sure you want to archive this application. This will hide it from user home pages. You should only do this after results have been released and this application is no longer necessary.",
    });
    if (confirmation) {
      try {
        await edit({
          variables: {
            ...application,
            archived: true,
          },
        });

        enqueueSnackbar("The application was successfully archived", {
          variant: "success",
        });
      } catch (e) {
        enqueueSnackbar("There was an error archiving. " + e.message, {
          variant: "error",
        });
      } finally {
        await refetch();
      }
    }
  };

  const unarchive = async () => {
    const confirmation = await confirmDialog({
      title: "Confirmation",
      body: "Are you sure you want to un-archive this application? This will cause it to show up on user home pages again. This will not re-open the application if it had been previously closed.",
    });

    if (confirmation) {
      try {
        await edit({
          variables: {
            ...application,
            archived: false,
          },
        });

        enqueueSnackbar("The application was successfully un-archived", {
          variant: "success",
        });
      } catch (e) {
        enqueueSnackbar("There was an error un-archiving. " + e.message, {
          variant: "error",
        });
      } finally {
        await refetch();
      }
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await edit({
        variables: {
          ...application,
          ...values,
        },
      });

      await setEditing(false);
      enqueueSnackbar("Changes were sucessfully saved", { variant: "success" });
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
      <BackButton label={"Back To Applications"} href={"/admin/application"} />
      <Typography variant={"h4"} align={"center"}>
        Admin Panel
      </Typography>
      <AdminTabBar />

      <Typography variant={"h5"} align={"center"}>
        {application.title}
      </Typography>

      {!editing && (
        <div className={styles.center}>
          {!application.archived && (
            <>
              <Button
                startIcon={<EditOutlined />}
                variant={"contained"}
                color={"primary"}
                className={styles.editButton}
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>

              <Button
                startIcon={<ArchiveOutlined />}
                variant={"contained"}
                color={"secondary"}
                className={styles.editButton}
                onClick={archive}
              >
                Archive
              </Button>
            </>
          )}

          {application.archived && (
            <Button
              startIcon={<RestoreOutlined />}
              variant={"contained"}
              color={"primary"}
              className={styles.editButton}
              onClick={unarchive}
            >
              UnArchive
            </Button>
          )}

          <Button className={styles.deleteButton} variant={"outlined"}>
            Delete
          </Button>
        </div>
      )}
      <div className={styles.center}>
        <ApplicationForm
          submitLabel={"Save"}
          disabled={loading || saving || !editing}
          initialValues={application}
          showCancelButton
          onSubmit={handleSubmit}
          onCancel={async ({ resetForm, values }) => {
            let confirmation = true;

            const changed = Object.keys(values).some(field => {
              const newVal = values[field];
              const currentVal = application[field];

              if (
                typeof currentVal === "string" ||
                typeof currentVal === "boolean"
              ) {
                return newVal !== currentVal;
              }

              console.log(newVal.toString(), currentVal.toString());
            });

            if (changed) {
              confirmation = await confirmDialog({
                title: "Confirm cancellation",
                body: "You've made changes to the form. If you cancel all those changes will be lost.",
                rejectionText: "Go Back To Editing",
                acceptanceText: "Confirm Cancellation",
              });
            }

            if (confirmation) {
              resetForm();
              setEditing(false);
            }
          }}
        />
      </div>
    </div>
  );
}

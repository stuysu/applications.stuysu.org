import { gql, useMutation, useQuery } from "@apollo/client";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import EditOutlined from "@material-ui/icons/EditOutlined";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import BackButton from "../../../comps/admin/BackButton";
import confirmDialog from "../../../comps/dialog/confirmDialog";
import FAQForm from "../../../comps/faq/FAQForm";
import { ObjectIdRegex } from "../../../constants";
import styles from "../../../styles/Admin.module.css";

const QUERY = gql`
  query ($id: ObjectID!) {
    faqById(id: $id) {
      id
      title
      url
      body
      updatedAt
    }
  }
`;

const DELETE_MUTATION = gql`
  mutation ($id: ObjectID!) {
    deleteFAQ(id: $id)
  }
`;

const EDIT_MUTATION = gql`
  mutation (
    $id: ObjectID!
    $title: NonEmptyString!
    $url: NonEmptyString!
    $body: NonEmptyString!
  ) {
    editFAQ(id: $id, title: $title, url: $url, body: $body) {
      id
      title
      url
      body
    }
  }
`;

const AdminHeading = () => (
  <>
    <BackButton href={"/admin/faq"} label={"Back To FAQs"} />

    <Typography variant={"h4"} align={"center"}>
      Admin Panel
    </Typography>
    <AdminTabBar />
  </>
);

export default function AdminFAQ() {
  const router = useRouter();
  const { id } = router.query || "";
  const isValidId = ObjectIdRegex.test(id);
  const [isEditing, setIsEditing] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [isDeleting, setIsDeleting] = useState(false);
  const { data, loading } = useQuery(QUERY, {
    variables: { id },
    skip: !isValidId,
  });

  useEffect(() => {
    if (window) {
      globalThis.window.onbeforeunload = isEditing ? () => true : null;
      return () => (globalThis.window.onbeforeunload = null);
    }
  }, [isEditing]);

  const [remove] = useMutation(DELETE_MUTATION, {
    variables: { id },
  });

  const [edit] = useMutation(EDIT_MUTATION);

  const onSave = async (values, { setSubmitting }) => {
    const { title, url, body } = values;

    if (globalThis.window) {
      ReactGA.event({
        category: "Interaction",
        action: "Attempted FAQ Edit Save",
        label: window.location.pathname,
        nonInteraction: false,
      });
    }

    try {
      await edit({
        variables: {
          title,
          url,
          body,
          id,
        },
      });
      setSubmitting(false);
      setIsEditing(false);
      enqueueSnackbar("Your edits were successfully saved", {
        variant: "success",
      });
    } catch (e) {
      enqueueSnackbar(e.message, { variant: "error" });
      setSubmitting(false);

      if (globalThis.window) {
        ReactGA.event({
          category: "Interaction",
          action: "FAQ Edit Save Error",
          label: e.message,
          nonInteraction: false,
        });
      }
    }
  };

  const handleDelete = async () => {
    const confirmation = await confirmDialog({
      title: "Confirm Deletion",
      body: "Are you sure you want to delete the FAQ? This action is irreversible!",
    });

    if (confirmation) {
      try {
        setIsDeleting(true);
        await remove();
        await router.push("/admin/faq?refetch=true");
      } catch (e) {
        enqueueSnackbar(e.message, { variant: "error" });
        setIsDeleting(false);
      }
    }
  };

  if (loading || isDeleting) {
    return (
      <div className={styles.container}>
        <AdminHeading />
        <div className={styles.center}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  const faq = data?.faqById;

  if (!isValidId || !faq) {
    return (
      <div className={styles.container}>
        <AdminHeading />

        <Typography variant={"h4"} align={"center"}>
          There's no faq with that id
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AdminHeading />

      <Typography variant={"h5"} align={"center"} gutterBottom>
        Manage FAQ
      </Typography>

      {!isEditing && (
        <div className={styles.center}>
          <Button
            children={"Edit"}
            variant={"contained"}
            startIcon={<EditOutlined />}
            color={"secondary"}
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          />

          <Button
            children={"Delete"}
            variant={"outlined"}
            startIcon={<DeleteOutlined />}
            className={styles.deleteButton}
            onClick={handleDelete}
          />
        </div>
      )}

      <div className={styles.center}>
        <FAQForm
          initialValues={faq}
          disabled={!isEditing}
          showCancelButton
          submitLabel={"Save"}
          onSubmit={onSave}
          onCancel={({ resetForm }) => {
            resetForm();
            setIsEditing(false);
          }}
        />
      </div>
    </div>
  );
}

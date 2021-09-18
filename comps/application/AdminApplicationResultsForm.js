import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import TinyEditor from "../shared/TinyEditor";
import styles from "./ApplicationForm.module.css";

const idStringToArr = (str, filter = true) =>
  str
    .toUpperCase()
    .replace(/[^A-F0-9,;\n ]/g, "")
    .split(/[,;\n ]/)
    .filter(a => !filter || Boolean(a));

function validate(values) {
  const errors = {};

  if (values.acceptedIds) {
    const invalidIds = values.acceptedIds
      .filter(Boolean)
      .filter(id => id.length !== 8);

    if (invalidIds.length) {
      errors.acceptedIds =
        "The following IDs are not valid: " + invalidIds.join(", ");
    }
  }

  if (values.rejectedIds) {
    const invalidIds = values.rejectedIds
      .filter(Boolean)
      .filter(id => id.length !== 8);

    if (invalidIds.length) {
      errors.rejectedIds =
        "The following IDs are not valid: " + invalidIds.join(", ");
    }
  }

  if (values.rejectedIds && values.acceptedIds) {
    const rejected = new Set(values.rejectedIds);

    for (let i = 0; i < values.acceptedIds.length; i++) {
      const acceptedId = values.acceptedIds[i];

      if (rejected.has(acceptedId)) {
        errors.rejectedIds =
          "The ID " +
          acceptedId +
          " is present in both the accepted and rejected ID list.";
        break;
      }
    }
  }

  return errors;
}

export default function AdminApplicationResultsForm({
  initialValues,
  onSubmit,
  submitLabel = "Submit",
  showCancelButton = false,
  cancelLabel = "Cancel",
  onCancel,
  disabled,
}) {
  const {
    touched,
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    submitForm,
    setFieldValue,
    setFieldError,
    resetForm,
  } = useFormik({
    initialValues: initialValues || {
      rejectedIds: [],
      acceptedIds: [],
      acceptanceMessage: "",
      rejectionMessage: "",
    },
    validateOnChange: false,
    validate,
    onSubmit,
  });
  const { enqueueSnackbar } = useSnackbar();

  return (
    <div>
      <Typography
        variant={"h4"}
        paragraph
        color={isSubmitting || disabled ? "textSecondary" : "secondary"}
      >
        Accepted Applicants
      </Typography>
      <TextField
        variant={"outlined"}
        label={"Accepted IDs"}
        value={values.acceptedIds.join(" ")}
        multiline
        rows={4}
        fullWidth
        name={"acceptedIds"}
        onBlur={async ev => {
          await setFieldValue(
            "acceptedIds",
            Array.from(new Set(values.acceptedIds.filter(Boolean)))
          );
          handleBlur(ev);
        }}
        helperText={touched.acceptedIds && errors.acceptedIds}
        error={touched.acceptedIds && errors.acceptedIds}
        onChange={ev =>
          setFieldValue("acceptedIds", idStringToArr(ev.target.value, false))
        }
        disabled={isSubmitting || disabled}
      />
      <Typography
        variant={"body1"}
        className={styles.tinyTitle}
        color={"textSecondary"}
      >
        Message For Accepted Students:
      </Typography>

      <TinyEditor
        value={values.acceptanceMessage}
        setValue={setFieldValue.bind(setFieldValue, "acceptanceMessage")}
        disabled={isSubmitting || disabled}
      />
      <br />

      <Typography
        variant={"h4"}
        paragraph
        className={styles.idTitle}
        color={isSubmitting || disabled ? "textSecondary" : "error"}
      >
        Rejected Applicants
      </Typography>
      <TextField
        variant={"outlined"}
        label={"Rejected IDs"}
        value={values.rejectedIds.join(" ")}
        multiline
        rows={4}
        fullWidth
        name={"rejectedIds"}
        onBlur={async ev => {
          await setFieldValue(
            "rejectedIds",
            Array.from(new Set(values.rejectedIds.filter(Boolean)))
          );
          handleBlur(ev);
        }}
        helperText={touched.rejectedIds && errors.rejectedIds}
        error={touched.rejectedIds && errors.rejectedIds}
        onChange={ev =>
          setFieldValue("rejectedIds", idStringToArr(ev.target.value, false))
        }
        disabled={isSubmitting || disabled}
      />
      <Typography
        variant={"body1"}
        color={"textSecondary"}
        className={styles.tinyTitle}
      >
        Rejection Message
      </Typography>
      <TinyEditor
        value={values.rejectionMessage}
        setValue={setFieldValue.bind(setFieldValue, "rejectionMessage")}
        disabled={isSubmitting || disabled}
      />
      <Button
        className={styles.containedButton}
        color={"primary"}
        variant={"contained"}
        disabled={isSubmitting || disabled}
        children={submitLabel}
        onClick={submitForm}
      />

      {showCancelButton && (
        <Button
          variant={"outlined"}
          onClick={ev =>
            onCancel({
              ev,
              touched,
              values,
              errors,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              submitForm,
              setFieldValue,
              setFieldError,
              resetForm,
            })
          }
          disabled={disabled || isSubmitting}
          className={styles.button}
        >
          {cancelLabel}
        </Button>
      )}
    </div>
  );
}

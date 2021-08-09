import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useFormik } from "formik";
import styles from "./ApplicationForm.module.css";

async function validate(values) {}

function getDefaultUrl(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9- ]/g, "")
    .replace(/\s+/g, "-")
    .substr(0, 50);
}

export default function ApplicationForm({
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
      title: "",
      url: "",
      body: "",
    },
    validateOnChange: false,
    onSubmit,
    validate,
  });

  const handleTitleChange = ev => {
    const titleWasModified = getDefaultUrl(values.title) !== values.url;

    const newTitle = ev.target.value;
    if (!titleWasModified) {
      setFieldValue("url", getDefaultUrl(newTitle));
    }

    setFieldValue("title", newTitle);
  };

  const handleUrlChange = ev => {
    setFieldValue("url", getDefaultUrl(ev.target.value));
  };

  return (
    <div className={styles.root}>
      <TextField
        className={styles.textField}
        label={"Title"}
        value={values.title}
        onChange={handleTitleChange}
        name={"title"}
        variant={"outlined"}
        error={touched.title && !!errors.title}
        helperText={touched.title && errors.title}
        placeholder={"Sophomore Caucus Staff Applications 2019-2020"}
        disabled={disabled || isSubmitting}
        onBlur={handleBlur}
      />

      <TextField
        label={"URL"}
        value={values.url}
        onChange={handleUrlChange}
        name={"url"}
        variant={"outlined"}
        error={touched.url && !!errors.url}
        helperText={
          touched.url && errors.url
            ? errors.url
            : "applications.stuysu.org/application/" + values.url
        }
        placeholder={"sophomore-caucus-staff-19-20"}
        disabled={disabled || isSubmitting}
        onBlur={handleBlur}
        className={styles.textField}
      />

      <hr className={styles.hr} />

      <Button
        className={styles.button}
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

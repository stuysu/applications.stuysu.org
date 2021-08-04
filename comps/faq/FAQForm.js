import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useFormik } from "formik";
import TinyEditor from "../shared/TinyEditor";
import styles from "./FAQForm.module.css";

async function validate(values) {
  const errors = {};

  if (!values.title) {
    errors.title = "Required";
  }

  if (!values.url) {
    errors.url = "Required";
  }

  if (!values.body) {
    errors.body = "Required";
  }

  return errors;
}

function getDefaultUrl(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9- ]/g, "")
    .replace(/\s+/g, "-")
    .substr(0, 50);
}

export default function FAQForm({
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
        placeholder={"Why does the site need access to my Google Drive?"}
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
            : "applications.stuysu.org/faq/" + values.url
        }
        placeholder={"why-google-drive"}
        disabled={disabled || isSubmitting}
        onBlur={handleBlur}
        className={styles.textField}
      />
      <TinyEditor
        value={values.body}
        setValue={val => setFieldValue("body", val)}
        className={styles.tinyEditor}
        helperText={touched.body && errors.body}
        error={touched.body && !!errors.body}
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

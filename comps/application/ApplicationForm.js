// pick a date util library
import { gql } from "@apollo/client";
import MomentUtils from "@date-io/moment";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import StyledLink from "@material-ui/core/Link";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { useFormik } from "formik";
import isUrl from "is-url";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import { TwitterPicker } from "react-color";
import getReadableDuration from "../../utils/date/getReadableDuration";
import client from "../apollo/client";
import DateContext from "../date/DateContext";
import alertDialog from "../dialog/alertDialog";
import TinyEditor from "../shared/TinyEditor";
import styles from "./ApplicationForm.module.css";

async function validate(values) {
  const errors = {};

  if (!values.title) {
    errors.title = "Required";
  }

  if (values.title?.length > 128) {
    errors.title = "Title cannot be longer than 128 characters";
  }

  if (!values.url) {
    errors.url = "Required";
  }

  if (values.url?.length > 128) {
    errors.url = "Url cannot be longer than 128 characters";
  }

  if (values.link && !isUrl(values.link)) {
    errors.link = "The provided url is not valid";
  }

  if (!values.deadline) {
    errors.deadline = "Required";
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

const URL_EMBEDDABLE_QUERY = gql`
  query ($url: URL!) {
    isEmbeddable(url: $url)
  }
`;

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
      link: "",
      embed: false,
      type: "anonymous",
      color: "#6c5ce7",
      more: "",
      deadline: null,
    },
    validateOnChange: false,
    onSubmit,
    validate,
  });
  const [isValidatingLink, setIsValidatingLink] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleEmbedClick = async () => {
    if (values.embed) {
      await setFieldValue("embed", false);
      return;
    }

    setIsValidatingLink(true);
    try {
      const { data } = await client.query({
        query: URL_EMBEDDABLE_QUERY,
        variables: { url: values.link },
      });

      if (data.isEmbeddable) {
        await setFieldValue("embed", true);
      } else {
        await alertDialog({
          title: "Cannot Embed URL",
          body: "That url is not embeddable. Usually with Google forms, that means you need to open up the form to people outside your organization. If you would rather not do that, don't select the embed option.",
        });
      }
    } catch (e) {
      enqueueSnackbar(e.message, { variant: "error" });
    } finally {
      setIsValidatingLink(false);
    }
  };

  const { getNow } = useContext(DateContext);

  useEffect(() => {
    if (!values.link) {
      setFieldValue("embed", false);
    }
  }, [values.link]);

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

  let deadlineText;

  const now = getNow();

  if (values.deadline) {
    const prefix = values.deadline > new Date() ? "In " : "";
    const end = values.deadline < new Date() ? " Ago" : "";
    const deadline = moment(values.deadline);

    const duration = moment.duration(Math.abs(deadline.diff(now)));
    deadlineText = prefix + getReadableDuration(duration) + end;
  }

  return (
    <div className={styles.root}>
      <div>
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
      </div>

      <div>
        <TextField
          label={"Link To Application"}
          value={values.link}
          name={"link"}
          onChange={handleChange}
          variant={"outlined"}
          error={touched.link && errors.link}
          helperText={touched.link && errors.link}
          placeholder={"https://forms.google.com/xxx-xxx-xxx"}
          disabled={disabled || isSubmitting}
          onBlur={handleBlur}
          className={styles.largeTextField}
        />
      </div>

      <div className={styles.checkbox}>
        <FormControl>
          <FormControlLabel
            disabled={disabled || isSubmitting || !values.link}
            control={
              isValidatingLink ? (
                <CircularProgress size={20} style={{ margin: "1rem" }} />
              ) : (
                <Checkbox
                  checked={!!values.link && !!values.embed}
                  onChange={handleEmbedClick}
                  name={"embed"}
                  disabled={
                    disabled || isSubmitting || !values.link || isValidatingLink
                  }
                />
              )
            }
            label="Embed Form On Site"
          />
          <FormHelperText>Only Google Forms can be embedded</FormHelperText>
        </FormControl>
      </div>

      <div className={styles.switch}>
        <Typography component="div">
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>Fully Anonymous</Grid>
            <Grid item>
              <Switch
                disabled={disabled || isSubmitting}
                checked={values.type === "hybrid"}
                onChange={() =>
                  setFieldValue(
                    "type",
                    values.type === "hybrid" ? "anonymous" : "hybrid"
                  )
                }
                name="hybrid"
              />
            </Grid>
            <Grid item>Hybrid Anonymity</Grid>
          </Grid>
          <FormHelperText>
            For more information on the difference{" "}
            <StyledLink
              href={"/faq/what-are-anonymity-types"}
              target={"_blank"}
              referrerPolicy={"no-referrer"}
            >
              click here
            </StyledLink>
          </FormHelperText>
        </Typography>
      </div>

      <MuiPickersUtilsProvider utils={MomentUtils}>
        <FormGroup row className={styles.deadline}>
          <FormControl component="fieldset" disabled={disabled || isSubmitting}>
            <FormLabel
              component="legend"
              className={styles.deadlineLabel}
              disabled={disabled || isSubmitting}
            >
              Deadline
            </FormLabel>
            <KeyboardDateTimePicker
              variant="inline"
              inputVariant={"outlined"}
              value={values.deadline}
              onChange={val =>
                setFieldError("deadline", null) & setFieldValue("deadline", val)
              }
              onError={(...e) => console.log("moment error", ...e)}
              format="MM/DD/yyyy hh:mma"
              ampm
              onBlur={handleBlur}
              name={"deadline"}
              error={
                (touched.deadline && !!errors.deadline) ||
                (values.deadline && values.deadline < now)
              }
              helperText={
                touched.deadline && errors.deadline
                  ? errors.deadline
                  : deadlineText
              }
              disabled={disabled || isSubmitting}
              placeholder="05/05/2021 06:00am"
            />
          </FormControl>
        </FormGroup>
      </MuiPickersUtilsProvider>

      <div className={styles.color}>
        <Typography
          gutterBottom
          variant={"body1"}
          className={styles.label}
          style={{ color: values.color }}
        >
          Application Color
        </Typography>
        <FormHelperText>
          This will show up alongside the application. Use this to help
          distinguish your application from others when there are multiple at
          the same time
        </FormHelperText>
        {!disabled && !isSubmitting && (
          <TwitterPicker
            className={styles.picker}
            color={values.color}
            onChangeComplete={c => setFieldValue("color", c.hex)}
          />
        )}
      </div>

      <div className={styles.tiny}>
        <Typography variant={"body1"} className={styles.label} gutterBottom>
          Any other content you want to display on the application page:
        </Typography>
        <TinyEditor
          value={values.more}
          disabled={disabled || isSubmitting}
          setValue={v => setFieldValue("more", v)}
          helperText={"This field is optional and can be left empty"}
          placeholder={
            "(Optional) i.e. This application will close on September 1st, 11:59pm"
          }
        />
      </div>

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

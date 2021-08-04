import Typography from "@material-ui/core/Typography";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { TINYMCE_API_KEY } from "../../constants";

async function uploadPicture(picture) {
  const jwt = localStorage.getItem("jwt");

  const formData = new FormData();
  formData.append("file", picture);

  const config = {
    method: "post",
    url: "/api/upload",
    headers: {
      Authorization: jwt,
    },
    data: formData,
  };

  const { data } = await axios(config);

  return data;
}

const TinyEditor = ({
  value,
  setValue,
  className,
  disabled,
  helperText,
  error,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <div className={className}>
      <Editor
        value={value}
        apiKey={TINYMCE_API_KEY}
        init={{
          body_class: "sanitized-html",
          height: 400,
          menubar: false,
          default_link_target: "_blank",
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "formatselect | bold italic forecolor backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | link image media | removeformat",
          automatic_uploads: true,
          browser_spellcheck: true,
          images_upload_handler: (file, success, failure) => {
            uploadPicture(file.blob())
              .then(({ data }) => success(data?.url))
              .catch(failure);
          },
          images_upload_url: false,
          media_alt_source: false,
          media_poster: false,
          resize_img_proportional: true,
          media_dimensions: false,
          media_url_resolver: (data, resolve, reject) => {
            const url = new window.URL(data.url);
            const allowedHosts =
              /^(?:\w|\d|\.)*(?:youtube\.com|vimeo\.com|youtu\.be)$/;
            const hostIsAllowed = !!url.hostname.match(allowedHosts);
            if (hostIsAllowed) {
              resolve("");
            } else {
              enqueueSnackbar(
                "You're only allowed to embed videos from YouTube or Vimeo",
                { variant: "error" }
              );
              reject(
                new Error(
                  "You're only allowed to embed videos from youtube or vimeo"
                )
              );
            }
          },
        }}
        disabled={disabled}
        onEditorChange={newValue => setValue(newValue)}
      />
      <Typography
        variant={"subtitle2"}
        color={error ? "error" : undefined}
        children={helperText}
      />
    </div>
  );
};

export default TinyEditor;

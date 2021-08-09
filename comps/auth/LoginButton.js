import { gql, useMutation } from "@apollo/client";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import GoogleLogin from "react-google-login";
import { GOOGLE_CLIENT_ID } from "../../constants";
import alertDialog from "../dialog/alertDialog";

const LOGIN_MUTATION = gql`
  mutation ($idToken: JWT!) {
    login(idToken: $idToken)
  }
`;

const driveScope = "https://www.googleapis.com/auth/drive.file";

export default function LoginButton() {
  const [login, { loading }] = useMutation(LOGIN_MUTATION);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const showDriveDialog = () =>
    alertDialog({
      title: "Must Authorize Google Drive",
      body: (
        <>
          <Typography variant={"body1"} paragraph gutterBottom>
            This app needs the ability to store its app data in your Google
            Drive to function properly. To get a better understanding of why,
            visit this url:
          </Typography>
          <Link href={"/faq/why-google-drive"} target={"_blank"}>
            https://applications.stuysu.org/faq/why-google-drive.
          </Link>
        </>
      ),
    });

  const onFailure = er => {
    if (er.error === "popup_closed_by_user") {
      // Do nothing
    } else if (
      er.message === "Drive Not Authorized" ||
      er.error === "access_denied"
    ) {
      showDriveDialog();
    } else {
      enqueueSnackbar(er.message, { variant: "error" });
    }
  };

  const onSignIn = async data => {
    const { accessToken, tokenId: idToken } = data;
    const { scope } = data.getAuthResponse(true);

    try {
      if (!scope.includes(driveScope)) {
        throw new Error("Drive Not Authorized");
      }

      const { data } = await login({
        variables: { idToken },
      });
      localStorage.setItem("jwt", data.login);

      const url = new globalThis.URL(
        "/setup-anonymity-secret",
        window.location.origin
      );

      url.searchParams.append("referrer", router.asPath);
      url.searchParams.append("accessToken", accessToken);

      window.location.href = url.href;
    } catch (er) {
      onFailure(er);
    }
  };

  return (
    <GoogleLogin
      clientId={GOOGLE_CLIENT_ID}
      buttonText="Login with Google"
      onSuccess={onSignIn}
      onFailure={onFailure}
      cookiePolicy={"single_host_origin"}
      hostedDomain={"stuy.edu"}
      scope={driveScope}
      disabled={loading}
    />
  );
}

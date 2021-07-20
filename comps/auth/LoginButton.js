import { gql, useMutation } from "@apollo/client";
import GoogleLogin from "react-google-login";
import { GOOGLE_CLIENT_ID } from "../../constants";

const LOGIN_MUTATION = gql`
  mutation ($accessToken: NonEmptyString!, $idToken: JWT!) {
    login(accessToken: $accessToken, idToken: $idToken)
  }
`;

export default function LoginButton() {
  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  const onSignIn = async data => {
    const { accessToken, tokenId: idToken } = data;

    try {
      const { data } = await login({
        variables: { accessToken, idToken },
      });
      localStorage.setItem("jwt", data.login);
      window.location.reload();
    } catch (er) {
      alert(er.message);
    }
  };

  return (
    <GoogleLogin
      clientId={GOOGLE_CLIENT_ID}
      buttonText="Login with Google"
      onSuccess={onSignIn}
      onFailure={console.log}
      cookiePolicy={"single_host_origin"}
      hostedDomain={"stuy.edu"}
      scope={
        "https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/drive.appdata"
      }
      disabled={loading}
    />
  );
}

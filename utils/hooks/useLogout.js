import { gql, useMutation } from "@apollo/client";
import ReactGA from "react-ga";

const MUTATION = gql`
  mutation {
    logout
  }
`;

export default function useLogout() {
  const [cookieLogout, { loading }] = useMutation(MUTATION);

  const logout = async () => {
    if (globalThis.window) {
      ReactGA.event({
        category: "Session",
        action: "User Logged Out",
        label: globalThis.location?.pathname,
        nonInteraction: false,
      });
    }

    // destroy localstorage session data
    globalThis.localStorage.clear();

    // ask the server to destroy the jwt cookie
    try {
      await cookieLogout();

      window.location.reload();
    } catch (e) {
      alert(
        "There was an error logging you out on the server. Please try again."
      );
    }
  };

  return { logout, loading };
}

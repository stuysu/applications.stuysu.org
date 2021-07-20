import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import UserContext, { defaultValue } from "./UserContext";

const QUERY = gql`
  query {
    authenticatedUser {
      id
      firstName
      lastName
      email
      picture
      adminPrivileges
    }
  }
`;

export default function UserProvider({ children }) {
  const { data, loading, error } = useQuery(QUERY);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (error) {
      alert(
        "There was an error loading session information. Try refreshing the page."
      );
    }
  }, [error]);

  useEffect(() => {
    if (!loading) {
      const user = data.authenticatedUser;

      if (user) {
        setValue({
          signedIn: true,
          adminPrivileges: user.adminPrivileges,
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          picture: user.picture,
        });
      } else {
        setValue(defaultValue);
      }
    }
  }, [data]);

  return <UserContext.Provider value={value} children={children} />;
}

import { gql, useApolloClient } from "@apollo/client";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import DateContext from "./DateContext";

const QUERY = gql`
  query {
    date
  }
`;
export default function DateProvider({ children }) {
  const [offset, setOffset] = useState(0);
  const client = useApolloClient();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const start = new Date();
    client
      .query({ query: QUERY })
      .then(({ data }) => {
        const end = new Date();

        const requestTime = end.getTime() - start.getTime();

        const serverRequestOriginationTime = new Date(data.date);
        const correctedServerTime = new Date(
          serverRequestOriginationTime.getTime() + requestTime
        );
        const localTime = new Date();

        setOffset(correctedServerTime.getTime() - localTime.getTime());
      })
      .catch(() => {
        enqueueSnackbar(
          "There was an error getting the time from the server. Time calculations will be made using your computer's time which may or may not be accurate.",
          { variant: "error" }
        );
      });
  }, []);

  const getNow = () => new Date(Date.now() + offset);

  const value = {
    offset,
    getNow,
  };

  return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
}

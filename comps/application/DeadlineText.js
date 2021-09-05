import Typography from "@material-ui/core/Typography";
import capitalizeText from "@material-ui/core/utils/capitalize";
import { useContext, useEffect, useRef, useState } from "react";
import getReadableDate from "../../utils/date/getReadableDate";
import DateContext from "../date/DateContext";

export default function DeadlineText({
  deadline,
  interval = 5000,
  showWarning,
  warningDiff = 1000 * 60 * 60,
  capitalize = true,
}) {
  const [counter, setCounter] = useState(0);
  const { getNow } = useContext(DateContext);
  const now = getNow();
  const timeout = useRef(null);

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    if (interval) {
      setTimeout(() => setCounter((counter + 1) % 10), interval);
    }
  }, [counter]);

  const diff = new Date(deadline).getTime() - now.getTime();

  const text = getReadableDate(deadline, now);

  return (
    <Typography
      variant={"inherit"}
      component={"span"}
      color={
        showWarning && diff > 0
          ? diff < warningDiff
            ? "error"
            : "secondary"
          : undefined
      }
      style={{
        color:
          showWarning && diff > 0 && diff > warningDiff ? "#27ae60" : undefined,
        fontWeight:
          showWarning && diff > 0 && diff < warningDiff ? "bold" : undefined,
      }}
    >
      {capitalize ? capitalizeText(text) : text}
    </Typography>
  );
}

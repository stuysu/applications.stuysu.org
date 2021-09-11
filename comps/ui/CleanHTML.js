import { sanitize } from "dompurify";
import { useEffect, useState } from "react";

export default function CleanHTML({ html }) {
  const [clean, setClean] = useState("");

  useEffect(() => {
    setClean(sanitize(html));
  }, [html]);

  return (
    <div
      className={"html-content"}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

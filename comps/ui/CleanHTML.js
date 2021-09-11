import { sanitize } from "dompurify";
import { useEffect, useState } from "react";

export default function CleanHTML({ html, style }) {
  const [clean, setClean] = useState("");

  useEffect(() => {
    setClean(sanitize(html, { ADD_ATTR: ["target"] }));
  }, [html]);

  return (
    <div
      className={"html-content"}
      style={style}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

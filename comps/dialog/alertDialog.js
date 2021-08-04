import { queue } from "./SharedDialog";

export default function alertDialog({ title, body, dialogProps }) {
  return queue.add({
    type: "alert",
    title,
    body,
    dialogProps,
  });
}

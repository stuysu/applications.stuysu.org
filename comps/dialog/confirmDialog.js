import { queue } from "./SharedDialog";

export default function confirmDialog({
  title,
  body,
  dialogProps,
  acceptanceText,
  rejectionText,
}) {
  return queue.add({
    type: "confirm",
    title,
    body,
    dialogProps,
    acceptanceText: acceptanceText || "Confirm",
    rejectionText: rejectionText || "Cancel",
  });
}

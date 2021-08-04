import { useEffect, useState } from "react";
import DialogQueue from "./DialogQueue";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

export const queue = new DialogQueue({});

const SharedDialog = () => {
  const [item, setItem] = useState();

  useEffect(() => {
    queue.emitter.on("display", setItem);

    return () => queue.emitter.removeListener("display", setItem);
  });

  if (!item) {
    return null;
  }

  const handleClose = (resolveValue) => {
    const promise = item.promise;
    setItem(null);
    promise.resolve(resolveValue);
  };

  return (
    <Dialog
      open={true}
      {...item.dialogProps}
      onClose={() => handleClose(item.type === "confirm" ? false : null)}
    >
      <DialogTitle>{item.title}</DialogTitle>
      <DialogContent>
        {typeof item.body === "string" ? (
          <DialogContentText>{item.body}</DialogContentText>
        ) : (
          item.body
        )}
      </DialogContent>
      <DialogActions>
        {item.type === "alert" && (
          <Button onClick={() => handleClose(null)} color="primary">
            Ok
          </Button>
        )}

        {item.type === "confirm" && (
          <>
            <Button onClick={() => handleClose(false)} color="primary">
              {item.rejectionText}
            </Button>
            <Button onClick={() => handleClose(true)} color="primary">
              {item.acceptanceText}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SharedDialog;

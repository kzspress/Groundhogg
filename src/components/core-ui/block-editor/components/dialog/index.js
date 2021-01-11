import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { useState, useRef, useEffect, Fragment } from "@wordpress/element";

const ghDialog = ({
  buttonIcon,
  buttonTitle,
  title,
  content,
  dialogButtons,
  dialogAction,
  className,
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = (e) => {
    setOpen(false);
  };

  const handleAction = (e) => {
    setOpen(false);
    dialogAction();
  };

  const descriptionElementRef = useRef(null);

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <Fragment>
      <Button
        className={className}
        onClick={() => setOpen(true)}
        variant="contained"
        color="primary"
        size="small"
        startIcon={buttonIcon}
      >
        {buttonTitle}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {dialogButtons.map((button, index) => {
            if (button.label === "Cancel") {
              return (
                <Button onClick={handleClose} color={button.color} key={index}>
                  {button.label}
                </Button>
              );
            }

            return (
              <Button onClick={handleAction} color={button.color} key={index}>
                {button.label}
              </Button>
            );
          })}
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default ghDialog;

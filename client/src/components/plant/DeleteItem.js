import React, { useState } from "react";

import MyIconButton from "../layout/MyIconButton";
//Redux
import { useDispatch } from "react-redux";
//MUI
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
//MUI ICONS
import DeleteIcon from "@material-ui/icons/DeleteOutline";

const useStyles = makeStyles(() => ({
  delIcon: {
    color: "gray",
  },
  btn: {
    backgroundColor: "white",

    color: "red",
    "&:hover": {
      borderColor: "red",
    },
  },
}));

const DeleteItem = ({ itemId, delFunc, fontSize, history }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const dispach = useDispatch();
  const delItem = () => {
    dispach(delFunc(itemId));
    setOpen(false);
    history && history.push("/"); // if the deleted item is a plant on its own page
  };

  return (
    <>
      <MyIconButton title="Delete" clicked={() => setOpen(true)}>
        <DeleteIcon className={classes.delIcon} fontSize={fontSize} />
      </MyIconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Are You sure You want to delete this?</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
            color="secondary"
            className={classes.btn}
          >
            Cancel
          </Button>
          <Button onClick={delItem} variant="outlined" color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteItem;

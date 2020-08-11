import React, { useState, useEffect } from "react";
import MyIconButton from "../layout/MyIconButton";
//MUI
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
//MUI Icons
import EditIcon from "@material-ui/icons/Edit";
//Redux
import { useDispatch } from "react-redux";
import { editComment } from "../../redux/actions/dataActions";

const useStyles = makeStyles((theme) => ({
  inputField: {
    margin: 1,
  },
  editWrapper: {
    textAlign: "right",
  },
  btn: {
    backgroundColor: "white",

    color: "red",
    "&:hover": {
      borderColor: "red",
    },
  },
  icon: {
    color: "gray",
  },
}));
const EditProfile = ({ commentId, inicialBody, fontSize }) => {
  const classes = useStyles();
  const [body, setBody] = useState("");

  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setBody(inicialBody);
  }, [inicialBody]);

  const handleInputChange = (e) => {
    setBody(e.target.value);
  };

  const handleSubmit = () => {
    dispatch(editComment(commentId, { body: body }));
    setOpen(false);
  };

  return (
    <>
      <div className={classes.editWrapper}>
        <MyIconButton title="Edit Profile" clicked={() => setOpen(true)}>
          <EditIcon className={classes.icon} fontSize={fontSize} />
        </MyIconButton>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Your Comment</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              name="Comment"
              type="text"
              label="Edit comment"
              multiline
              rows="3"
              color="secondary"
              placeholder="Edit comment"
              className={classes.inputField}
              value={body}
              onChange={handleInputChange}
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
            color="secondary"
            className={classes.btn}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="outlined" color="secondary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditProfile;

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
//Icons
import EditIcon from "@material-ui/icons/Edit";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { editUserProfile } from "../../redux/actions/userActions";

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
}));
const EditProfile = () => {
  const classes = useStyles();
  const [userDetails, setUserDetails] = useState({
    bio: "",
    ocupation: "",
    location: "",
    website: "",
  });
  const [open, setOpen] = useState(false);
  const credentials = useSelector((state) => state.user.credentials);

  const dispatch = useDispatch();

  useEffect(() => {
    const { bio, ocupation, location, website } = credentials;
    setUserDetails({
      bio: bio || "",
      ocupation: ocupation || "",
      location: location || "",
      website: website || "",
    });
  }, [credentials]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = () => {
    dispatch(editUserProfile(userDetails));
    setOpen(false);
  };

  return (
    <>
      <div className={classes.editWrapper}>
        <MyIconButton title="Edit Profile" clicked={() => setOpen(true)}>
          <EditIcon color="disabled" />
        </MyIconButton>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Your Profile</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              name="bio"
              type="text"
              label="Bio"
              multiline
              rows="3"
              color="secondary"
              placeholder="A short bio about yourself"
              className={classes.inputField}
              value={userDetails.bio}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="ocupation"
              type="text"
              label="Ocupation"
              placeholder="What do you do?"
              color="secondary"
              className={classes.inputField}
              value={userDetails.ocupation}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="location"
              type="text"
              label="Location"
              placeholder="Where do you live?"
              color="secondary"
              className={classes.inputField}
              value={userDetails.location}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="website"
              type="text"
              label="Website"
              placeholder="Your personal website"
              color="secondary"
              className={classes.inputField}
              value={userDetails.website}
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

import React, { useState } from "react";
import Loader from "../layout/Loader";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { postComment } from "../../redux/actions/dataActions";
//MUI
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(() => ({
  inputField: {
    margin: "1em auto 1em auto",
  },
  button: {
    margin: "1em auto 1em auto",
  },
  errorMsg: {
    color: "red",
    fontSize: "0.8rem",
  },
  loader: {
    margin: "0 auto",
  },
}));
const PostComent = ({ plantId }) => {
  const classes = useStyles();
  const [body, setBody] = useState("");
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.ui.loading);
  const errors = useSelector((state) => state.ui.errors);
  const authenticated = useSelector((state) => state.user.authenticated);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(postComment(plantId, { body: body }));
    setBody("");
  };

  return (
    <div className={classes.commentForm}>
      {authenticated ? (
        <form onSubmit={handleSubmit}>
          <TextField
            name="body"
            type="text"
            color="secondary"
            label="Comment on plant"
            error={errors.comment ? true : false}
            helperText={errors.comment}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            fullWidth
            className={classes.textField}
          />
          {loading ? (
            <Loader width={40} height={40} classN={classes.loader} />
          ) : (
            <Button
              type="submit"
              variant="outlined"
              color="secondary"
              className={classes.button}
              onClick={handleSubmit}
              disabled={loading}
            >
              Submit
            </Button>
          )}
        </form>
      ) : (
        <p>You must be loged in to like and comment.</p>
      )}
    </div>
  );
};

export default PostComent;

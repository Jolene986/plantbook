import React from "react";
import { Link } from "react-router-dom";
import MyIconButton from "../layout/MyIconButton";
// MUI
import { makeStyles } from "@material-ui/core/styles";
// MUI Icons
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

const useStyles = makeStyles((theme) => ({
  favIcon: {
    color: theme.palette.primary.dark,
  },
}));

const Like = (props) => {
  const classes = useStyles();

  const likeButton = !props.user.authenticated ? (
    <MyIconButton title="Like">
      <Link to={"/login"}>
        <FavoriteBorderIcon
          fontSize={props.fontSize}
          className={classes.favIcon}
        />
      </Link>
    </MyIconButton>
  ) : props.liked() ? ( //is plant or comment already liked
    <MyIconButton
      fontSize={props.fontSize}
      title="Unlike"
      clicked={
        props.unlike //dispatch the unlike plant or unlike comment
      }
    >
      <FavoriteIcon className={classes.favIcon} fontSize={props.fontSize} />
    </MyIconButton>
  ) : (
    <MyIconButton
      title="Like"
      clicked={
        props.like //dispatch the like plant or like comment
      }
    >
      <FavoriteBorderIcon
        className={classes.favIcon}
        fontSize={props.fontSize}
      />
    </MyIconButton>
  );
  return likeButton;
};

export default Like;

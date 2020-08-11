import React from "react";
import dayjs from "dayjs";

import Like from "../plant/Like";
import DeleteItem from "./DeleteItem";
import EditComment from "./EditComment";

//RRD
import { Link } from "react-router-dom";
import relativeTime from "dayjs/plugin/relativeTime";
///MUI
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
//Redux
import { useDispatch, useSelector } from "react-redux";
import {
  likeComment,
  unlikeComment,
  deleteComment,
} from "../../redux/actions/dataActions";

const useStyles = makeStyles(() => ({
  root: {
    marginBottom: 10,
  },
  comment: {
    padding: "0 0.5em",
    paddingBottom: "0px",
  },
}));

const Comment = ({
  comment: { username, userImg, body, createdAt, plantId, likes, commentId },
}) => {
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  let isOwnComment = user.credentials.username === username;
  dayjs.extend(relativeTime);

  const likedComment = () => {
    if (
      user.commentlikes &&
      user.commentlikes.find((like) => like.commentId === commentId)
    )
      return true;
    else return false;
  };

  return (
    <>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar
              className={classes.avatar}
              alt="profile picture"
              src={userImg}
            />
          }
          action={
            user.authenticated && isOwnComment ? (
              <>
                <DeleteItem
                  itemId={commentId}
                  delFunc={deleteComment}
                  fontSize={"small"}
                />
                <EditComment
                  commentId={commentId}
                  inicialBody={body}
                  fontSize={"small"}
                />
              </>
            ) : null
          }
          title={
            <Typography
              className={classes.username}
              variant={"h5"}
              component={Link}
              to={`/user/${username}`}
            >
              {username}
            </Typography>
          }
          subheader={dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
        />

        <CardContent className={classes.comment}>
          <Typography variant="body1" color="textPrimary" component="p">
            {body}
          </Typography>
          <Like
            fontSize={"small"}
            user={user}
            liked={likedComment}
            like={() => dispatch(likeComment(commentId))}
            unlike={() => dispatch(unlikeComment(commentId))}
          />
          <span>{likes}</span>
        </CardContent>
      </Card>
    </>
  );
};

export default Comment;

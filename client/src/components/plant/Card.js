import React from "react";
import { Link } from "react-router-dom";
//dayjs to format posted
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MyIconButton from "../layout/MyIconButton";
import DeleteItem from "./DeleteItem";
import Like from "../plant/Like";

//import {useIsOwnProfile} from '../hooks/hooks'
//Redux
import {
  likePlant,
  unlikePlant,
  deletePlant,
} from "../../redux/actions/dataActions";
import { useDispatch, useSelector } from "react-redux";
//MUI
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";

import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
// MUI Icons

import CommentRoundedIcon from "@material-ui/icons/CommentRounded";

//react share
import {
  FacebookShareButton,
  PinterestShareButton,
  TwitterShareButton,
  ViberShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  PinterestIcon,
  WhatsappIcon,
  ViberIcon,
} from "react-share";

let shareUrl = `${String(window.location)}`;

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    maxWidth: "610px",
    width: "90%",
    margin: "0 auto",
    marginTop: "2%",
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  username: {
    color: theme.palette.secondary.main,
    "&:hover": {
      color: theme.palette.secondary.light,
    },
  },
  icon: {
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
  plantTitle: {
    paddingBottom: "0.5rem",
    paddingLeft: "1.3rem",
  },
  media: {
    height: 0,
    paddingTop: "46.25%", // 16:9
    width: "95%",
    margin: "0 auto",
    "&:hover": {
      cursor: "pointer",
    },
  },
  description: {
    paddingTop: "1rem",
  },
  plantInfo: {
    color: theme.palette.secondary.dark,
  },

  gridRoot: {
    flexGrow: 1,
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
  icons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalDiv: {
    outline: "none",
  },
  modalImg: {
    width: "100%",
    outline: "none",
    border: "2px solid white",
    boxShadow: theme.shadows[5],
  },
}));

const PlantCard = ({
  plant: {
    category,
    description,
    imgUrl,
    location,
    posted,
    title,
    userImg,
    username,
    commonName,
    scientificName,
    family,
    likes,
    commentCount,
    plantId,
  },
  history,
}) => {
  dayjs.extend(relativeTime);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user); //logedin user

  let isOwnPlant = user.credentials.username === username; // if true show more options button

  // chek if the loged in user already liked this plant
  const likedPlant = () => {
    if (user.likes && user.likes.find((like) => like.plantId === plantId))
      return true;
    else return false;
  };

  return (
    <>
      <Card className={classes.cardRoot} variant="outlined">
        <CardHeader
          avatar={
            <Avatar
              className={classes.avatar}
              alt="profile picture"
              src={userImg}
            />
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
          subheader={dayjs(posted).fromNow() + " " + location}
          action={
            user.authenticated && isOwnPlant ? (
              <DeleteItem
                itemId={plantId}
                delFunc={deletePlant}
                fontSize={"large"}
                history={history}
              />
            ) : null
          }
        />
        <Typography
          veriant="h5"
          className={classes.plantTitle}
          component={Link}
          to={`/plant/${plantId}`}
        >
          {title}
        </Typography>
        {imgUrl ? (
          <CardMedia
            className={classes.media}
            image={imgUrl}
            onClick={() => setOpen(true)}
          />
        ) : (
          "Loading Image ...."
        )}

        <CardContent>
          <div className={classes.gridRoot}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography
                  variant="subtitle1"
                  component="p"
                  className={classes.plantInfo}
                >
                  Common Name:
                </Typography>
                <Typography variant="subtitle1" component="p">
                  {commonName}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography
                  variant="subtitle1"
                  component="p"
                  className={classes.plantInfo}
                >
                  Scientific Name:
                </Typography>
                <Typography variant="subtitle1" component="p">
                  {scientificName}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography
                  variant="subtitle1"
                  component="p"
                  className={classes.plantInfo}
                >
                  Family:
                </Typography>
                <Typography variant="subtitle1" component="p">
                  {family}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography
                  variant="subtitle1"
                  component="p"
                  className={classes.plantInfo}
                >
                  Category:
                </Typography>
                <Typography variant="subtitle1" component="p">
                  {category}
                </Typography>
              </Grid>
            </Grid>
          </div>

          <Typography
            variant="body1"
            color="textPrimary"
            component="p"
            className={classes.description}
            align="left"
          >
            {description}
          </Typography>
          <Like
            fontSize={"large"}
            liked={likedPlant}
            like={() => dispatch(likePlant(plantId))}
            unlike={() => dispatch(unlikePlant(plantId))}
            user={user}
          />
          <span>{likes}</span>
          <Link to={`/plant/${plantId}`}>
            <MyIconButton title="comments">
              <CommentRoundedIcon
                fontSize="large"
                color="action"
                className={classes.icon}
              />
            </MyIconButton>
          </Link>
          <span>{commentCount} </span>
          {user.authenticated ? null : (
            <Typography variant="subtitle1" component="p" align="center">
              You must be logged in to like and comment
            </Typography>
          )}
        </CardContent>
        <CardActions disableSpacing className={classes.icons}>
          <FacebookShareButton
            url={shareUrl}
            quote={title}
            className={"socialIcons"}
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton
            url={shareUrl}
            title={title}
            className={"socialIcons"}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton
            url={shareUrl}
            title={title}
            separator=":: "
            className={"socialIcons"}
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <PinterestShareButton
            url={shareUrl}
            media={`${String(imgUrl)}`}
            className={"socialIcons"}
          >
            <PinterestIcon size={32} round />
          </PinterestShareButton>
          <ViberShareButton
            url={shareUrl}
            title={title}
            className={"socialIcons"}
          >
            <ViberIcon size={32} round />
          </ViberShareButton>
        </CardActions>
      </Card>
      <Modal
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.modalDiv}>
            <img src={imgUrl} alt={commonName} className={classes.modalImg} />
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default PlantCard;

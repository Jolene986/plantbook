import React from "react";
import dayjs from "dayjs";
//MUI
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
//Redux
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  paper: {},
  profile: {
    padding: "1rem",
    "& .image-wrapper": {
      textAlign: "center",
      position: "relative",
      "& button": {
        position: "absolute",
        top: "80%",
        left: "70%",
      },
    },
    "& .profile-image": {
      width: 200,
      height: 200,
      objectFit: "cover",
      maxWidth: "100%",
      borderRadius: "50%",
    },
    "& .profile-details": {
      textAlign: "center",
      "& span, svg": {
        verticalAlign: "middle",
      },
      "& a": {
        color: theme.palette.primary.dark,
      },
    },
    "& hr": {
      border: "none",
      margin: "0 0 10px 0",
    },
    "& svg.button": {
      "&:hover": {
        cursor: "pointer",
      },
    },
  },
  buttons: {
    textAlign: "center",
    "& a": {
      margin: "20px 10px",
    },
  },
}));
const AnyUserProfile = ({
  user: { username, createdAt, imgUrl, bio, ocupation, website, location },
}) => {
  const classes = useStyles();
  const isAuthenticated = useSelector((state) => state.user.authenticated);

  let profileMarkup = (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <img src={imgUrl} alt="profile" className="profile-image" />
        </div>
        <hr />
        {
          <div className="profile-details">
            <Typography color="secondary" variant={"h5"}>
              {username}
            </Typography>
            {isAuthenticated ? (
              <>
                {ocupation && (
                  <Typography variant={"body1"}>{ocupation}</Typography>
                )}
                <hr />
                {bio && <Typography variant="body1">{bio}</Typography>}
                <hr />
                {location && (
                  <>
                    <LocationOn color="secondary" /> <span>{location}</span>
                    <hr />
                  </>
                )}
                {website && (
                  <>
                    <LinkIcon color="secondary" />
                    <a
                      href={website}
                      target="_blank"
                      rel=" noopener noreferrer"
                    >
                      {" "}
                      {website}
                    </a>
                    <hr />
                  </>
                )}
              </>
            ) : null}
            <CalendarToday color="secondary" />{" "}
            <span>Herbalist sins {dayjs(createdAt).format("MMM YYYY")}</span>
          </div>
        }
      </div>
    </Paper>
  );

  return <div>{profileMarkup}</div>;
};

export default AnyUserProfile;

import React, { useRef } from "react";
import dayjs from "dayjs";
import MyIconButton from "../layout/MyIconButton";
import Loader from "../layout/Loader";
import EditProfile from "../profile/EditProfile";
//mui
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
//redux
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../../redux/actions/userActions";
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

const Profile = ({
  user: { username, createdAt, imgUrl, bio, ocupation, website, location },
}) => {
  const classes = useStyles();
  const loadingUser = useSelector((state) => state.user.loading);

  const dispatch = useDispatch();
  const fileInput = useRef();

  const handleImgUpload = (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);

    dispatch(uploadImage(formData));
  };
  const handleImgChange = () => {
    fileInput.current.click();
  };

  let profileMarkup = !loadingUser ? (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <img src={imgUrl} alt="profile" className="profile-image" />

          <>
            <input
              type="file"
              id="imgInput"
              hidden="hidden"
              onChange={handleImgUpload}
              ref={fileInput}
            />

            <MyIconButton
              title="Edit Profile Picture"
              clicked={handleImgChange}
            >
              <AddAPhotoIcon color="disabled" fontSize="large" />
            </MyIconButton>
          </>
        </div>
        <hr />
        {
          <div className="profile-details">
            <Typography color="secondary" variant={"h5"}>
              {username}
            </Typography>
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
                <a href={website} target="_blank" rel=" noopener noreferrer">
                  {" "}
                  {website}
                </a>
                <hr />
              </>
            )}
            <CalendarToday color="secondary" />{" "}
            <span>Herbalist sins {dayjs(createdAt).format("MMM YYYY")}</span>
            <hr />
            <EditProfile />
          </div>
        }
      </div>
    </Paper>
  ) : (
    <Loader classN="loader" />
  );

  return <div>{profileMarkup}</div>;
};

export default Profile;

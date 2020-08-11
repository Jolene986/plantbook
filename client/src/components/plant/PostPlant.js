import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Loader from "../layout/Loader";
import MyIconButton from "../layout/MyIconButton";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { postPlant } from "../../redux/actions/dataActions";
//MUI
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

//MUI ICONS
import AddIcon from "@material-ui/icons/AddCircleOutline";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";


let letters = { Ё: "YO", Й: "I", Ц: "TS", У: "U", К: "K", Е: "E", Н: "N", Г: "G", Ш: "SH", Щ: "SCH", З: "Z", Х: "H", Љ: "LJ", ё: "yo", й: "i", ц: "ts", у: "u", к: "k", е: "e", н: "n", г: "g", ш: "sh", щ: "sch", з: "z", х: "h", ъ: "'", Ф: "F", Ы: "I", В: "V", А: "a", П: "P", Р: "R", О: "O", Л: "L", Д: "D", Ж: "ZH", Э: "E", ф: "f", ы: "i", в: "v", а: "a", п: "p", р: "r", о: "o", л: "l", д: "d", ж: "z", э: "e", Я: "Ya", Ч: "CH", С: "S", М: "M", И: "I", Т: "T", љ: "lj", Б: "B", Ю: "YU", я: "ya", ч: "ch", с: "s", м: "m", и: "i", т: "t", ь: "'", б: "b", ю: "yu", Њ: "NJ", њ: "nj", };

const transliterate = (word) => {
  return word
    .split("")
    .map((char) => {
      return letters[char] || char;
    })
    .join("");
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles((theme) => ({
  inputField: {
    margin: 1,
  },
  btn: {
    backgroundColor: "white",

    color: "red",
    "&:hover": {
      borderColor: "red",
    },
  },
  imageInput: {
    textAlign: "center",
  },
  error: {
    color: "red",
  },
}));
const PostPlant = () => {
  const classes = useStyles();
  const [location, setLocation] = useState(null); // set current user location by reverse geolocation
  const [userLocation, setUserLocation] = useState(""); // set final location to post as plants location
  const [open, setOpen] = useState(false); // open dialog
  const fileInput = useRef();
  const [plantImage, setPlantImage] = useState(""); // if is empty string submit button is disabled
  const [loadingImg, setLoadingImg] = useState(false);
  const [plantImgError, setPlantImgError] = useState(false);
  const dispatch = useDispatch();
  const { loading, errors } = useSelector((state) => state.ui); // ui loading when posting new Plant
  const [openErrors, setOpenErrors] = useState(false);
  const [plantDetails, setPlantDetails] = useState({
    title: "",
    description: "",
    commonName: "",
    scientificName: "",
    family: "",
    category: "Wild plants",
  });
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      console.log("error");
    }
  }, []);
  useEffect(() => {
    if (location !== null) {
      axios
        .get(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.latitude}&lon=${location.longitude}`
        )
        .then((res) => {
          let address = res.data.address;

          setUserLocation(
            address.city_district || address.city || address.country
          );
        })

        .catch((err) => console.log(err));
    }
  }, [location]);
  useEffect(() => {
    if (userLocation !== "") {
      setUserLocation(transliterate(userLocation));
    }
  }, [userLocation]);

  const handleImgUpload = (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    setLoadingImg(true);

    axios
      .post("/plant/image", formData)
      .then((res) => {
        setPlantImage(res.data.imgUrl);
        setLoadingImg(false);
      })
      .catch((err) => {
        console.log(err);
        setPlantImgError(true);
        setLoadingImg(false);
      });
  };
  const handleImgChange = () => {
    fileInput.current.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlantDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    let newPlant = {
      location: userLocation,
      imgUrl: plantImage,
      title: plantDetails.title,
      description: plantDetails.description,
      category: plantDetails.category,
      commonName: plantDetails.commonName,
      scientificName: plantDetails.scientificName,
      family: plantDetails.family,
    };

    dispatch(postPlant(newPlant));
    setOpen(false);
    //set form to inicial state / empty
    setPlantImage("");
    setPlantDetails({
      title: "",
      description: "",
      commonName: "",
      scientificName: "",
      family: "",
      category: "Wild plants",
    });
    if (errors.error) {
      setOpenErrors(true);
    }
  };
  const handleErrorClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenErrors(false);
  };

  return (
    <>
      <MyIconButton title="Post a Plant" clicked={() => setOpen(true)}>
        <AddIcon color="secondary" fontSize="large" />
      </MyIconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Post A New Plant</DialogTitle>
        <DialogContent>
          <div className={classes.imageInput}>
            {loadingImg ? (
              <Loader />
            ) : (
              <>
                <img width="150" height="150" src={plantImage} alt="" />

                <input
                  type="file"
                  id="imgInput"
                  hidden="hidden"
                  onChange={handleImgUpload}
                  ref={fileInput}
                />

                {plantImage === "" ? (
                  <MyIconButton
                    title="Add Plant Image"
                    clicked={handleImgChange}
                  >
                    <AddAPhotoIcon color="secondary" fontSize="large" />
                  </MyIconButton>
                ) : null}
                {plantImgError ? (
                  <p className={classes.error}>
                    Something went wrong, please try again.
                  </p>
                ) : null}
              </>
            )}
          </div>
          <form>
            <TextField
              name="title"
              type="text"
              label="Title"
              placeholder="Your Title"
              color="secondary"
              className={classes.inputField}
              value={plantDetails.title}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="commonName"
              type="text"
              label="Common Name"
              placeholder="Common name of the Plant"
              color="secondary"
              className={classes.inputField}
              value={plantDetails.commonName}
              onChange={handleInputChange}
            />
            <TextField
              name="scientificName"
              type="text"
              label="Scientific Name"
              placeholder="Scientific name of the plant"
              color="secondary"
              className={classes.inputField}
              value={plantDetails.scientificName}
              onChange={handleInputChange}
            />
            <TextField
              name="description"
              type="text"
              multiline
              rows="2"
              label="Description"
              color="secondary"
              placeholder="Something about the plant"
              className={classes.inputField}
              value={plantDetails.description}
              onChange={handleInputChange}
              fullWidth
            />

            <TextField
              name="family"
              type="text"
              label="Family"
              placeholder="Family"
              color="secondary"
              className={classes.inputField}
              value={plantDetails.family}
              onChange={handleInputChange}
              fullWidth
            />
            <InputLabel id="select-label">Select Category</InputLabel>
            <Select
              labelId="select-label"
              id="simple-select"
              value={plantDetails.category}
              onChange={handleInputChange}
              name="category"
            >
              <MenuItem value={"House plants"}>House plants</MenuItem>
              <MenuItem value={"Wild plants"}>Wild plants</MenuItem>
            </Select>
          </form>
          {plantImage === "" ? (
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              align="right"
            >
              You must add a photo of a plant to submit.
            </Typography>
          ) : null}
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

          {loading ? (
            <Loader width={40} height={40} classN={classes.loader} />
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleSubmit}
              disabled={loading || plantImage === ""}
            >
              Submit
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={openErrors}
        autoHideDuration={6000}
        onClose={handleErrorClose}
      >
        <Alert onClose={handleErrorClose} severity="error">
          Something went wrong! Please try again later.
        </Alert>
      </Snackbar>
    </>
  );
};

export default PostPlant;

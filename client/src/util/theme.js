export default {
  palette: {
    primary: {
      main: "#f5fffa",
      dark: "#F29494", // logo pink
      contrastText: "#00a152",
    },
    secondary: {
      light: "#33eb91",
      main: "#00e676",
      dark: "#00a152",
      contrastText: "#fff",
    },
    action: {
      main: "red",
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  spacing: 8,
  typography: {
    useNextVariants: true,
  },
  profile: {
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
        color: "#00bcd4",
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
};

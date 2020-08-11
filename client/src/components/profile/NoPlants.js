import React from "react";

import image from "../../images/noPlants.png";
//MUI
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: "3rem",
  },
  title: {
    marginTop: "1rem",
  },
}));

const NoPlants = ({ isOwnProfile }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img src={image} alt="sad plant" />
      {isOwnProfile ? (
        <Typography className={classes.title} variant={"h5"}>
          You Have No Plants
        </Typography>
      ) : (
        <Typography className={classes.title} variant={"h5"}>
          This User Has No Plants
        </Typography>
      )}
    </div>
  );
};

export default NoPlants;

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.primary.dark,
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 12,
    border: "1px solid",
    borderColor: theme.palette.primary.dark,
  },
}));

const MyIconButton = ({ children, clicked, title, btnClassName }) => {
  const classes = useStyles();

  return (
    <Tooltip arrow classes={classes} title={title} placement="top">
      <IconButton onClick={clicked} className={btnClassName}>
        {children}
      </IconButton>
    </Tooltip>
  );
};
export default MyIconButton;

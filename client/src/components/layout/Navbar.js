import React from "react";
import logo from "../../images/logo3.png";
import MyIconButton from "../layout/MyIconButton";
import PostPlant from "../plant/PostPlant";
import Notifications from "./Notifications";
//RRD
import { Link } from "react-router-dom";
//MIU
import Appbar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import HomeIcon from "@material-ui/icons/Home";
import LogoutIcon from "@material-ui/icons/ExitToApp";

//redux
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/actions/userActions";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  logo: {
    maxWidth: 100,
  },
  navButton: {
    textTransform: "none",
    fontSize: 22,
    color: theme.palette.secondary.main,
  },
  navContainer: {
    margin: 0,
    width: "100%",
    padding: "0px",
  },
  gridItem: {
    alignSelf: "center",
    padding: "0px",
    textAlign: "end",
    paddingRight: "1em",
  },
}));


const Navbar = (props) => {
  const classes = useStyles();
  const authenticated = useSelector((state) => state.user.authenticated);
  const avatar = useSelector((state) => state.user.credentials.imgUrl);
  const username = useSelector((state) => state.user.credentials.username);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
  };
  return (
    <div className={classes.root}>
      <Appbar>
        <Toolbar className={classes.navContainer}>
          <Grid container>
            <Grid item sm={2} xs={12}>
              <img src={logo} alt="logo" className={classes.logo} />
            </Grid>
            <Grid item sm={10} xs={12} className={classes.gridItem}>
              <Link to="/">
                <MyIconButton title="Home">
                  <HomeIcon color="secondary" fontSize="large" />
                </MyIconButton>
              </Link>
              {authenticated ? (
                <>
                  <PostPlant />
                  <Notifications />
                  <MyIconButton
                    title="Logout"
                    clicked={handleLogout}
                    component={Link}
                    to="/"
                  >
                    <LogoutIcon color="secondary" fontSize="large" />
                  </MyIconButton>
                  <MyIconButton title="Profile">
                    <Avatar
                      alt="profile picture"
                      src={avatar}
                      className={classes.small}
                      component={Link}
                      to={`/user/${username}`}
                    />
                  </MyIconButton>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/signup"
                    className={classes.navButton}
                  >
                    Sign up
                  </Button>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                    className={classes.navButton}
                  >
                    Login
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </Appbar>
    </div>
  );
};

export default Navbar;

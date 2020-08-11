import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import loginImg from "../images/loginImg.png";
import Loader from "../components/layout/Loader";
//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
//redux
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../redux/actions/userActions";

const styles = {
  formContainer: {
    textAlign: "center",
  },
  formImg: {
    background: `url(${loginImg})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "center",
  },
  title: {
    margin: "0.5em auto 0.5em auto",
  },
  formRight: {},
  inputField: {
    margin: "0em auto 1em auto",
  },
  button: {
    margin: "1em auto 1em auto",
  },
  errorMsg: {
    color: "red",
    fontSize: "0.8rem",
  },
  loader: {
    margin: "0 auto",
  },
};

const Signup = (props) => {
  const { classes } = props;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.ui.loading);
  const errors = useSelector((state) => state.ui.errors);

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      username,
      email,
      password,
      confirmPassword,
    };
    dispatch(signupUser(userData, props.history));
  };

  return (
    <>
      <Grid container className={classes.formContainer}>
        <Grid item xs={12} sm={1}></Grid>

        <Grid item xs={12} sm={4} className={classes.formRight}>
          <Typography
            variant={"h4"}
            color={"secondary"}
            className={classes.title}
          >
            Sign up
          </Typography>
          <form noValidate onSubmit={handleSubmit} id="form">
            <TextField
              id="username"
              name="username"
              label="Username"
              type="text"
              color="secondary"
              className={classes.inputField}
              value={username}
              helperText={errors.username}
              error={errors.email ? true : false}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
            <TextField
              id="email"
              name="email"
              label="Email"
              type="email"
              color="secondary"
              className={classes.inputField}
              value={email}
              helperText={errors.email}
              error={errors.email ? true : false}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              id="password"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              color="secondary"
              className={classes.inputField}
              value={password}
              helperText={errors.password}
              error={errors.password ? true : false}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {" "}
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Visibility color={"secondary"} />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="confPassword"
              name="confPassword"
              label="Confirm Password"
              type={showConfPassword ? "text" : "password"}
              color="secondary"
              className={classes.inputField}
              value={confirmPassword}
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {" "}
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfPassword(!showConfPassword)}
                    >
                      {showConfPassword ? (
                        <Visibility color={"secondary"} />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {errors.general && (
              <Typography variant={"body2"} className={classes.errorMsg}>
                {errors.general}
              </Typography>
            )}
            {loading ? (
              <Loader width={40} height={40} classN={classes.loader} />
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={handleSubmit}
                disabled={loading}
              >
                Submit
              </Button>
            )}

            <br />
            <div>
              <small>
                You already have an account? <Link to={"/login"}> Login</Link>
              </small>
            </div>
          </form>
        </Grid>

        <Grid item xs={12} sm={6} className={classes.formImg}></Grid>
        <Grid item xs={12} sm={1}></Grid>
      </Grid>
    </>
  );
};

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Signup);

import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import "./App.css";
import jwtDecode from "jwt-decode";
//components
import Navbar from "./components/layout/Navbar";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import UserPage from "./pages/userPage";
import ErrorPage from "./pages/ErrorPage";
import PlantPage from "./pages/plantPage";

//MUI
import theme from "./util/theme";
import { ThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
//redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";

const myTheme = createMuiTheme(theme);
axios.defaults.baseURL = "";

//check auth

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
  } else {
    store.dispatch({
      type: SET_AUTHENTICATED,
    });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

const App = () => {
  return (
    <ThemeProvider theme={myTheme}>
      <Provider store={store}>
        <div className="App">
          <Router>
            <Navbar />
            <div className="container">
              <Switch>
                <Route path="/" component={Home} exact></Route>
                <Route path="/signup" component={Signup} exact />
                <Route path="/login" component={Login} exact />
                <Route path="/user/:username" component={UserPage} exact />
                <Route path="/plant/:plantId" component={PlantPage} exact />
                <Route component={ErrorPage} />
              </Switch>
            </div>
          </Router>
        </div>
      </Provider>
    </ThemeProvider>
  );
};

export default App;

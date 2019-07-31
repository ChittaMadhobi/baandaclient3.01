import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux"; // Provides the app with a store. This wraps around everything (as below)
import store from "./store";

import Navbar from "./entrance/components/layout/Navbar/Navbar";
import Footer from "./entrance/components/layout/Footer/Footer";

import Lobby from "./entrance/components/layout/Lobby";

import Login from "./entrance/components/auth/Login";
import Register from "./entrance/components/auth/Register";
import MyAccount from "./account/myAccount/MyAccount";

import UserInitPersona from "./intelligence/components/persona/UserInitPersona";
import ShowPersona from './intelligence/components/persona/ShowPersona';

import Dashboard from './dashboard/components/dashboardMain/dashboard';

import "./App.css";

// Check for token
if (localStorage.jwtToken) {
  // localStorage.clear();
  // console.log('localstorage jwtToken:', localStorage.jwtToken);
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // console.log('decoded jwttoken:', decoded);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // logout the user
    store.dispatch(logoutUser());
    // TODO: clear current profile
    // Redirect to login
    window.location.href = "/login";
  }
} else {
  console.log('localstorage jwttoken not defined');
  localStorage.clear();
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="total-space">
            <div className="navbar-space">
              {/* <h6 className="text-center">
                Build Together - Band Together - Bond Together
              </h6> */}
            </div>
            <Navbar />

            <div className="container">
              <Route exact path="/" component={Lobby} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/lobby" component={Lobby} />
              <Route exact path="/myaccount" component={MyAccount} />
              <Route exact path="/userinitpersona" component={UserInitPersona} />
              <Route exact path="/mirror" component={ShowPersona} />

              <Route exact path="/dashboard" component={Dashboard} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

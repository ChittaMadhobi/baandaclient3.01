/*
 **  Author: Jit (Sarbojit Mukherjee)
 **  Desc:   Provies navigation to landing, lobby, signup, or signin based on state of user's authenticaiton.
 **
 **  Date:   Julye 9, 2018
 **  Version:0.01
 */
import React, { Component } from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { logoutUser } from "../../../../actions/authActions";

import Toolbar from "./Toolbar/Toolbar";
import SideDrawer from "./SideDrawer/SideDrawer";
import Backdrop from "../Backdrop/Backdrop";

class Navbar extends Component {
  state = {
    sideDrawerOpen: false,
    logoutFlag: false
  };

  onLogoutClick = () => {
    // e.preventDefault();
    // console.log("onLogoutClick this.props.history:", this.props);
    this.setState({ sideDrawerOpen: false });
    this.props.logoutUser(this.props.history);
    console.log("onLogoutClick this.props.history:", this.props);
    this.props.history.push("/login");
  };

  onSignupClick = () => {
    this.setState({ sideDrawerOpen: false });
    this.props.history.push("/register");
  };

  onMyAccountClick = () => {
    this.setState({ sideDrawerOpen: false });
    this.props.history.push("/myaccount");
  };

  onLobbyClickApp = () => {
    this.setState({ sideDrawerOpen: false });
    this.props.history.push("/lobby");
  };

  componentWillMount = () => {
    console.log("componentWillMount Navbar this.props", this.props);
    var url = window.location.search.substring(1);
    var qArray = url.split("&");
    if (qArray.length > 0) {
      for (var i = 0; i < qArray.length; i++) {
        var pArr = qArray[i].split("=");
        console.log(
          "navbar i. pArr[0] & pArr[1] : " +
            (i + 1) +
            ". " +
            pArr[0] +
            " & " +
            pArr[1]
        );
        if (pArr[0] === "type") {
          if (pArr[1] === "logout") {
            this.props.logoutUser(this.props.history);
            this.props.history.push("/login");
          }
          if (pArr[1] === "finance") {
            // this.props.logoutUser(this.props.history);
            this.props.history.push("/finance");
          }
        }
      }
    }
  };

  drawerToggleClickHandler = () => {
    if (this.state.sideDrawerOpen) {
      localStorage.setItem("backdrop", "close");
    } else {
      localStorage.setItem("backdrop", "open");
    }

    this.setState(prevState => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen };
    });
    let yy = localStorage.getItem("backdrop");
    console.log("drawToggleClickHandler:" + yy);
    if (yy === "close") {
      this.setState({ sideDrawerOpen: false });
    }
  };

  backdropClickHandler = () => {
    this.setState({ sideDrawerOpen: false });
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    console.log(
      "Navbar isAuthenticate:",
      isAuthenticated,
      "  user:",
      user,
      " this.props.auth:",
      this.props.auths
    );

    const toolbar = (
      <Toolbar
        drawerClickHandler={this.drawerToggleClickHandler}
        onSignupClickApp={this.onSignupClick}
        onLogoutClickApp={this.onLogoutClick}
        onMyAccountClickApp={this.onMyAccountClick}
        onLobbyClickApp={this.onLobbyClickApp}
        auth={this.props.auth}
      />
    );

    const sideDrawer = (
      <SideDrawer
        show={this.state.sideDrawerOpen}
        onSignupClickApp={this.onSignupClick}
        onLogoutClickApp={this.onLogoutClick}
        onMyAccountClickApp={this.onMyAccountClick}
        onLobbyClickApp={this.onLobbyClickApp}
        auth={this.props.auth}
      />
    );

    let backdrop;
    if (this.state.sideDrawerOpen) {
      // sideDrawer = <SideDrawer />;
      backdrop = <Backdrop CloseSideDrawer={this.backdropClickHandler} />;
    }

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4 fixed-top">
        <div className="container">
          {toolbar}
          {sideDrawer}
          {backdrop}
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(Navbar));

import React, { Component } from "react";
import { Link } from "react-router-dom";

import DrawerToggleButton from "../SideDrawer/DrawerToggleButton";
import "./Toolbar.css";

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }

  render() {
    // let isAuthenticated = this.props.isAuthenticated;
    const { isAuthenticated, user } = this.props.auth;
    console.log('Toolbar props:', this.props);
    // let isAuthenticated = true;
    // let user1 = this.props.user;
    // let user = { name: "Sarbojit Mukherjee" };
    // console.log(
    //   "Toolbar: user",
    //   user,
    //   " isAuthenticated:",
    //   isAuthenticated + " props:",
    //   this.props
    // );
    // if (this.props.logoutFlag) {
    //   console.log("Toolbar ... logged out ...:", this.props.logoutFlag);
    // }

    let navbardisp;
    if (isAuthenticated) {
      // console.log("Toolbar: I am in isAuthenticated");
      navbardisp = (
        <div>
          <ul>
            <li>
              <button
                onClick={this.props.onLobbyClickApp}
                className="transparent-button"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={this.props.onMyAccountClickApp}
                className="transparent-button"
              >
                MyAccount
              </button>
            </li>
            <li>
              <button
                onClick={this.props.onLogoutClickApp}
                className="transparent-button"
              >
                {user.name}&nbsp;<font color="#bef587" size="2">(Credits: {user.availableCredits})</font> &nbsp;&nbsp; Logout
              </button>
            </li>
          </ul>
        </div>
      );
    } else {
      // console.log("Toolbar: I am Logged out");

      navbardisp = (
        <div>
          <ul>
            <li>
              <button
                onClick={this.props.onSignupClickApp}
                className="transparent-button"
              >
                {this.state.user} &nbsp;&nbsp; Sign Up
              </button>
            </li>
            <li>
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          </ul>
        </div>
      );
    }

    return (
      <div>
        <header className="toolbar">
          <nav className="toolbar_navigation">
            <div className="toolbar__toggle-button">
              <DrawerToggleButton click={this.props.drawerClickHandler} />
            </div>
            <div className="toolbar_logo">
              <a href="/">Baanda</a>&nbsp; 
            </div>
            <div className="spacer" />
            <div className="toolbar_navigation-items">{navbardisp}</div>
          </nav>
        </header>
      </div>
    );
  }
}

export default Toolbar;

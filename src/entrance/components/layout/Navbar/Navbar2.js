import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { Redirect } from 'react-router-dom';



import SideDrawer from './SideDrawer/SideDrawer';
import Toolbar from './Toolbar/Toolbar';
import Backdrop from '../Backdrop/Backdrop';
import Login from '../../auth/Login';
import { logoutUser } from '../../../../actions/authActions';

class Navbar extends Component {
  state = {
    sideDrawerOpen: false,
    logoutFlag: false
  };

  componentWillMount() {
    localStorage.clear();
    console.log('componentWiiMount Navbar this.props' + JSON.stringify(this.props));
    var url = window.location.search.substring(1);
    var qArray = url.split('&');
    if (qArray.length > 0) {
      for (var i=0; i < qArray.length; i++) {
        var pArr = qArray[i].split('=');
        console.log('navbar i. pArr[0] & pArr[1] : ' + (i+1) + '. ' + pArr[0] + ' & ' + pArr[1]);
        if ( pArr[0] === 'type') {
          if ( pArr[1] === 'logout') {
            this.props.logoutUser(this.props.history);
            this.props.history.push('/login');
          }
          if ( pArr[1] === 'finance') {
            // this.props.logoutUser(this.props.history);
            this.props.history.push('/finance');
          }
        }
      }
    }
    // console.log('in app.js componentwillmount');
  }

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

  onSignupClick = () => {
    console.log("in onSignupClick");
    this.setState({ sideDrawerOpen: false });
    localStorage.removeItem("loggedout");
  };

  onLogoutClick = () => {
    console.log("logging out");
    this.setState({ 
      sideDrawerOpen: false,
      logoutFlag: true 
    });
    localStorage.setItem("loggedout", "yes");
    // return <Redirect to="/login" />;
  };

  render() {
    console.log('In navbar - props auth:', this.props.auth);
    let backdrop;
    // let loggedout = localStorage.getItem("loggedout");
    let loggedout = 'yes';
    // console.log('cloggedout:' + loggedout);

    if (this.state.sideDrawerOpen) {
      // sideDrawer = <SideDrawer />;
      backdrop = <Backdrop CloseSideDrawer={this.backdropClickHandler} />;
    }

    let redirectToLogin;
    if (loggedout === "yes") {
      console.log("Loging redirection if possible");
      redirectToLogin = <Login />;
    }

    return (
      <div className="total-space">
        <Toolbar
          drawerClickHandler={this.drawerToggleClickHandler}
          onSignupClickApp={this.onSignupClick}
          onLogoutClickApp={this.onLogoutClick}
          logoutFlag={this.state.logoutFlag}
          auth={this.props.auth}
        />
        <SideDrawer
          show={this.state.sideDrawerOpen}
          onSignupClickApp={this.onSignupClick}
          onLogoutClickApp={this.onLogoutClick}
        />
        {backdrop}
        {redirectToLogin}
      </div>
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
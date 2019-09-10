/*
 **  Author: Jit (Sarbojit Mukherjee)
 **  Desc:   Provides the basic landing for Baanda with two opetions ... to chat with Baanda
 **          or login / signin to get to the lobby
 **  Note:   Every program and aspects of Baanda_dev, as of this day, is being coded and handled by Jit
 **  Date:   July 9, 2018
 **  Version:0.01
 */
import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ModalContainer from "../../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../../actions/modalActions";
import "../../../modal/css/localModal.css";
import "../../../modal/css/template.css";

import "./Lobby.css";

class Lobby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dashboardFlag: true,
      isShowing: false,
      disabled: false
    };

    this.openAlertModal = this.openAlertModal.bind(this);
  }
  componentWillMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
    // console.log('lobby didmount : this.props.auth.user:', this.props.auth.user);
    // console.log('this.props.auth.user.isInitDone:', this.props.auth.user.isInitDone);
    if (!this.props.auth.user.isInitDone) {
      // console.log('From lobby componentdidmount');
      this.setState({
        dashboardFlag: false
      });
    }
  }

  openAlertModal = param => e => {
    // console.log('param : ' + param + ' user:' + this.props.auth.user.name)
    // let msg = 'This could be Jit ID: ' + param
    let msg = {
      Header: "This is start here header",
      Body: "This is start here body",
      Footer: "This is the footer"
    };
    this.props.showModal(
      {
        open: true,
        title: "Alert - Start Here Header",
        message: msg,
        closeModal: this.closeModal
      },
      "startHere"
    );
  };

  createTeamHandler = () => {
    if (!this.props.auth.user.isInitDone) {
      // Create initial persona
      this.props.history.push("/userinitpersona");
    } else if (!this.props.auth.user.isInitProfileDone) {
      // Create  initial profile
      this.props.history.push("/profilemgmt");
    } else {
      // Go and create/edit communities to author & publish
      this.props.history.push("/createcommunity");
    }
  };

  joinTeamHandler = () => {
    if (!this.props.auth.user.isInitDone) {
      // Create initial persona
      this.props.history.push("/userinitpersona");
    } else if (!this.props.auth.user.isInitProfileDone) {
      // Create  initial profile
      this.props.history.push("/profilemgmt");
    } else {
      // Go and create/edit communities to author & publish
      this.props.history.push("/joincommunity");
    }
  };

  dashboardHandler = () => {
    // Go to Dashboard (engage)
    this.props.history.push("/dashboard");
  };

  render() {
    console.log('this.props: ', this.props);
    // let joinMsg = "2 Invites, 1 Match";
    // let dashMsg = "3 New Messages";
    let joinMsg = "";
    let dashMsg = "";

    let teamUp = (
      <div className="domain-box">
        {" "}
        <div className="row">
          <div className="col text-center domain-box-header-text">
            Create Community - Team Up
          </div>
        </div>
        <div className="row">
          <div className="col panel_text">
            Co-op, Co-live, Co-serve & Co-Fun
          </div>
        </div>
        <div className="space-between-domains" />
        <div className="row">
          <div className="col text-center domain-box-header-text">
            <button
              className="btn-lobby"
              type="button"
              onClick={this.createTeamHandler}
              style={{ cursor: this.state.disabled ? "default" : "pointer" }}
            >
              <b>Create</b>
            </button>
          </div>
        </div>
      </div>
    );
    let meetup = (
      <div className="domain-box">
        <div className="row">
          <div className="col text-center domain-box-header-text">
            Join Communities - Meet Up
          </div>
        </div>
        <div className="row">
          <div className="col panel_text">
            Search, Browse, Matched, & Connect
          </div>
        </div>
        <div className="space-between-domains" />
        <div className="row">
          <div className="col text-center domain-box-header-text">
            <button
              className="btn-lobby"
              type="button"
              onClick={this.joinTeamHandler}
              style={{ cursor: this.state.disabled ? "default" : "pointer" }}
            >
              <b>Join</b>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-7">&nbsp;</div>
          <div className="col-4 joinMsg text-right">{joinMsg}</div>
          <div className="col-1">&nbsp;</div>
        </div>
      </div>
    );

    let dashboard;
    let spaceInbetween;
    if (this.state.dashboardFlag) {
      dashboard = (
        <div className="domain-box">
          <div className="row">
            <div className="col text-center domain-box-header-text">
              Engage - The Dashboard
            </div>
          </div>
          <div className="row">
            <div className="col panel_text">
              Communicate, Reflect, Serve & more ...
            </div>
          </div>
          <div className="space-between-domains" />
          <div className="row">
            <div className="col text-center domain-box-header-text">
              <button
                className="btn-lobby"
                type="button"
                onClick={this.dashboardHandler}
                style={{ cursor: this.state.disabled ? "default" : "pointer" }}
              >
                <b>Engage</b>
              </button>
            </div>
          </div>
          <div className="row">
          <div className="col-7">&nbsp;</div>
          <div className="col-4 joinMsg text-right">{dashMsg}</div>
          <div className="col-1">&nbsp;</div>
        </div>
        </div>
      );
      spaceInbetween = (
        <div>
          <div className="space-between-domains" />
        </div>
      );
    } else {
      spaceInbetween = (
        <div>
          <div className="space-between-domains" />
          <div className="space-between-domains" />
          <div className="space-between-domains" />
          <div className="space-between-domains" />
          <div className="space-between-domains" />
          <div className="space-between-domains" />
        </div>
      );
    }

    return (
      <div className="lobby">
        <div className="lobbyheader">
          <div className="row text-center text_white">
            <div className="col-12">
              Band Together - Bond Together - Build Together
            </div>
          </div>
        </div>
        {spaceInbetween}
        {teamUp}
        {spaceInbetween}
        {meetup}
        {spaceInbetween}
        {dashboard}
        <hr />
        <div className="col-12 text-center">
          <button
            className="btn-lobby-starthere"
            type="button"
            onClick={this.openAlertModal("tokenInput")}
            style={{ cursor: this.state.disabled ? "default" : "pointer" }}
          >
            <b>Overview</b>
          </button>
        </div>
        <div className="bottom_spaces" />
        <ModalContainer />
      </div>
    );
  }
}

Lobby.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  hideModal: () => dispatch(hideModal()),
  showModal: (modalProps, modalType) => {
    // console.log(
    //   "modalProps:" + JSON.stringify(modalProps) + "  |modalType:" + modalType
    // );
    dispatch(showModal({ modalProps, modalType }));
  }
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Lobby)
);

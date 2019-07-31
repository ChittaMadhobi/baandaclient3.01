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
      isShowing: false
    };

    this.openAlertModal = this.openAlertModal.bind(this);
  }
  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
    // console.log('lobby didmount : this.props.auth.user:', this.props.auth.user);
    console.log('this.props.auth.user.isInitDone:', this.props.auth.user.isInitDone);
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
      this.props.history.push("/userinitpersona");
    }
  };

  joinTeamHandler = () => {
    alert("This is a test join");
  };

  dashboardHandler = () => {
    alert("This is a test dashboard");
    this.props.history.push("/dashboard");
  };

  render() {
    const ans = "abcd";
    let teamUp = (
      <div className="domain-box">
        <div className="row">
          <div className="col text-center domain-box-header-text">
            Create Your Community - Team Up
          </div>
        </div>
        <div className="row">
          <div className="col">
            <font color="white" size="3">
              Do businss, offer services and products, co-live and more ...   
            </font>
          </div>
        </div>
        <div className="space-between-domains" />
        <div className="row">
          <div className="col text-center domain-box-header-text">
            <button
              className="btn-lobby"
              type="button"
              onClick={this.createTeamHandler}
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
            Join a Community - Meet Up
          </div>
        </div>
        <div className="row">
          <div className="col">
            <font color="white" size="3">
              Search, browse, and be matched for a happy togetherness   
            </font>
          </div>
        </div>
        <div className="space-between-domains" />
        <div className="row">
          <div className="col text-center domain-box-header-text">
            <button
              className="btn-lobby"
              type="button"
              onClick={this.joinTeamHandler}
            >
              <b>Join</b>
            </button>
          </div>
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
              Engage in your Community - Dashboard
            </div>
          </div>
          <div className="row">
          <div className="col">
            <font color="white" size="3">
              Engage in your community activities    
            </font>
          </div>
        </div>
        <div className="space-between-domains" />
        <div className="row">
          <div className="col text-center domain-box-header-text">
            <button
              className="btn-lobby"
              type="button"
              onClick={this.dashboardHandler}
            >
              <b>Engage</b>
            </button>
          </div>
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
        <div className="col-12 text-center">
          <button
            className="btn-lobby-starthere"
            type="button"
            onClick={this.openAlertModal(ans)}
          >
            <b>Start Here</b>
          </button>
        </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lobby);
// export default connect(mapStateToProps)(Lobby);

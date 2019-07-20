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

// import ModalContainer from '../../../modal/components/ModalContainer';
// import { showModal, hideModal } from '../../../actions/modalActions';
// import '../../../modal/css/localModal.css';
// import '../../../modal/css/template.css';



import "./Lobby.css";

class Lobby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dashboardFlag: false,
      isShowing: false
    };
  }
  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
  }

  openModalHandler = () => {
    this.setState({
      isShowing: true
    });
  };

  closeModalHandler = () => {
    this.setState({
      isShowing: false
    });
  };

  openSitePlanModal = () => {
    // console.log('param : ' + param);
    let msg = 'This could be Jit ID: ' ;
    console.log(msg);
    this.props.showModal(
      {
        open: true,
        title: 'Alert - Start Here Header',
        message: msg,
        closeModal: this.closeModal
      },
      'siteplan'
    )
  }

  somefun = () => {
    alert('This is a test');
  }
  render() {
    let teamUp = (
      <div className="domain-box">
        <div className="row">
          <div className="col text-center domain-box-header-text">
            Create Your Community - Team Up
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

              {/* <button
                type='button'
                onClick={this.openSitePlanModal}
              >
                <b>Start Here</b>
              </button> */}

        {spaceInbetween}
        {teamUp}
        {spaceInbetween}
        {meetup}
        {spaceInbetween}
        {dashboard}
          
        {/* <ModalContainer /> */}
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

// const mapDispatchToProps = dispatch => ({
//   hideModal: () => dispatch(hideModal()),
//   showModal: (modalProps, modalType) => {
//     console.log(
//       'modalProps:' + JSON.stringify(modalProps) + '  |modalType:' + modalType
//     )
//     dispatch(showModal({ modalProps, modalType }))
//   }
// })

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Lobby)
export default connect(mapStateToProps)(Lobby);

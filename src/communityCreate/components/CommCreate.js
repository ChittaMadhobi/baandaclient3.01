import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
// import axios from "axios";

import ModalContainer from "../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../actions/modalActions";
import "../../modal/css/localModal.css";
import "../../modal/css/template.css";

// import InitialProfile from "../../intelligence/components/persona/InitialProfile";
import InitialProfile from '../../intelligence/components/persona/InitialProfile';
import "./CommCreate.css";

class CommCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ""
    };
  }

  openAlertModal = () => {
    // console.log("param : " + param + " user:" + this.props.auth.user.name);
    // let msg = 'This could be Jit ID: ' + param
    let msg = {
      Header: "Creation Overview",
      Body: {
        oneLineSummary: "In this module you will be creating communities and market space for your goods & services. The initial minimal profile will be asked once.",
        steps: [
          {
            step: "Step 1.",
            stepNote:
              "Create a community. This may be virtual (to find like spirited people) or geo-location based for activities. It may be for co-living, co-workinng, schools, and/or even forming a customer community for your small business." 
          },
          {
            step: "Step 2: ",
            stepNote:
              "You can create a catalog that details your offerings. This catalog is not inventory and not necessarily for business. It may be a skill you want to pass on."
          },
          {
            step: "Step 3: ",
            stepNote:
              "You can associate sub-communities to a bigger community. For example, you may have several groups of same class in a semister. Students of a semister can be part of a school."
          },
          {
            step: "Step 4: ",
            stepNote:
              "You can offer your good and services to public or to a group. How you release it, when you release what aspects is up to you. You will do that in your Dashboard (Engage button in your home page)."
          }
        ],
        footnote: "In the creation of communities, you are the author and entrepreneure. It is possible that few of you decided to start something together. One of you can start and pass on the adminstrative right to other few of your core team for anyone to work on the community as adminstrators. If you have any question, plese ask in the Ask-Baanda button in your Engage module."
      },
      Footer: "This is the footer"
    };
    this.props.showModal(
      {
        open: true,
        title: "Alert - Start Here Header",
        message: msg,
        closeModal: this.closeModal
      },
      "infoModal"
    );
  };
  render() {
    console.log("comm create this props auth:", this.props.auth);

    let initProfilePanel = null;

    if (!this.props.auth.user.isInitProfileDone) {
      initProfilePanel = (
        // <div className="fixedsize_createProfile">
        <div>
          <InitialProfile />
        </div>
      );
    }

    return (
      <div>
        <div className="row page-top">
          <div className="col-8 dash_header">
            Create Communities & Offerings
          </div>
          <div className="col-4">
            <button
              className="btn-modal_create"
              type="button"
              onClick={this.openAlertModal}
            >
              <b>What is this?</b>
            </button>
          </div>
        </div>
        {initProfilePanel}
        <ModalContainer />
      </div>
    );
  }
}

CommCreate.propTypes = {
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
  // setQAInitDone: () => dispatch(setQAInitDone(userData))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommCreate);
// export default CommCreate;

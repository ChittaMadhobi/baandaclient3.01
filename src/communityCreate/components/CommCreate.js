import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
// import axios from "axios";

import ModalContainer from "../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../actions/modalActions";
import "../../modal/css/localModal.css";
import "../../modal/css/template.css";

import EditCreation from "./EditCreation";
import NewCreation from "./NewCreation";

import "./CommCreate.css";

class CommCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",

      infoModalContent: {
        Header: "",
        Body: {
          oneLineSummary: "",
          steps: [
            // Max five elements for now
            {
              step: "",
              stepNote: ""
            }
          ],
          footnote: ""
        },
        Footer: "" // optional
      },
      createFlag: true,
      editFlag: false
    };
  }

  // =========== Modal content creation functions
  // ++++++++ Create what-is-this button
  createInfoHandler = async () => {
    await this.setState({
      infoModalContent: {}
    });
    await this.setState({
      infoModalContent: {
        Header: "Overview - Create or Edit",
        Body: {
          oneLineSummary:
            "In this module you will be creating or editing communities and catalogs, then review and publish.",
          steps: [
            {
              step: "Point A:",
              stepNote:
                "Provide a unique name for your reference and a caption for others to see. You will be guided progressively."
            },
            {
              step: "Point B:",
              stepNote:
                "Communities may be for your business (good, service, expertise), form customer communities. You may be looking for expertise (help-wated) or offer service/expertise."
            },
            {
              step: "Point C: ",
              stepNote:
                "Communities may be to find right people with harmony, aligned chemistry, for co-living and/or co-working. You may be developer, architect, or other custom fecilitate to aid emerging co-living needs of the society."
            },
            {
              step: "Point D: ",
              stepNote:
                "You can form groups of family and/or friends for fun activitis, hobbies, adventures ... Imagine, world of togetherness awaits you."
            }
          ],
          footnote:
            "In the creation of communities, you are the author, entrepreneure, and dreamer. You may be an individual or a small group. For a  group, start solo and pass authority to selected few. For HOME page, click Home on navbar or side-drawer."
        },
        Footer: ""
      }
    });
    console.log("infoModalContent: ", this.state.infoModalContent);
    this.openAlertModal();
  };

  openAlertModal = () => {
    this.props.showModal(
      {
        open: true,
        title: "Alert - Start Here Header",
        message: this.state.infoModalContent, // message: msg,
        closeModal: this.closeModal
      },
      "infoModal"
    );
  };

  // Handle Edit Button
  editHandler = async () => {
    await this.setState({
      createFlag: false,
      editFlag: true
    });
  };

  newHandler = async () => {
    await this.setState({
      createFlag: true,
      editFlag: false
    });
  };

  render() {
    // console.log("comm create this props auth:", this.props.auth);

    let createEditToggleButton;
    let creationPanel;
    if (this.state.createFlag) {
      createEditToggleButton = (
        <div>
          <button
            className="btn-modal_create_n"
            type="button"
            onClick={this.createInfoHandler}
          >
            <b>Info</b>
          </button>
          &nbsp;&nbsp;
          <button
            className="btn-modal_create_n"
            type="button"
            onClick={this.editHandler}
          >
            <b>Edit</b>
          </button>
        </div>
      );
      creationPanel = (
        <div>
          <NewCreation />
        </div>
      );
    }
    if (this.state.editFlag) {
      createEditToggleButton = (
        <div>
          <button
            className="btn-modal_create_n"
            type="button"
            onClick={this.createInfoHandler}
          >
            <b>Info</b>
          </button>
          &nbsp;&nbsp;
          <button
            className="btn-modal_create_n"
            type="button"
            onClick={this.newHandler}
          >
            <b>New</b>
          </button>
        </div>
      );
      creationPanel = (
        <div>
          <EditCreation />
        </div>
      );
    }

    return (
      <div>
        <div className="row page-top">
          <div className="col-8 dash_header">
            Create & Edit Communities
          </div>
          <div className="col-4">{createEditToggleButton}</div>
        </div>
        {creationPanel}
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

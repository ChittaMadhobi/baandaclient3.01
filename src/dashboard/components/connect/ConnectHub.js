import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

// import axios from "axios";
// import Select from "react-select";

// import _ from "lodash";

import ModalContainer from "../../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../../actions/modalActions";
import "../../../modal/css/localModal.css";
import "../../../modal/css/template.css";

import GroupAdmin from "./grouping/GroupAdmin";
import GroupParticipate from "./grouping/GroupParticipate";

import "./ConnectHub.css";

class ConnectHub extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",

      groupingActiveFlag: true,
      talkingActiveFlag: false,
      feelingActiveFlag: false
    };
  }

  // This is to show the info panel
  openAlertModal = () => {
    let msg = {
      Header: "Your Connection Hub",
      Body: {
        oneLineSummary: `This has all the information about the activities of the store..`,
        steps: [
          {
            step: "Catalog",
            stepNote:
              "Catalog lets you enter new items your catalog and edit them. Only creator and adminstrators can manage catalog."
          },
          {
            step: "Inventory",
            stepNote:
              "This will let you enter, update, inventory of items of your catalog."
          },
          {
            step: "Reports",
            stepNote:
              "This provide you with various lists and report of catalog, inventory, sales, IOU (pending payments), feedbacks, and other intels progressively."
          },
          {
            step: "Connect",
            stepNote:
              "This will enable you to send request to other Baandas, respond to requests, messages, as well as send  messages with reference to the members of this community only. This will also enable you to provide multidimensional feedback of your experiences (in general), to particular baanda, and eventually request conflict resolution. This will also let you make and revoke someone for adminstrator."
          }
        ],
        footnote:
          "Assume this to be your own market space (your business). Everything you need to do in your store should be available here. If/when you want to request new functions, please head to your MyAccount and send Request Improvement to Baanda team."
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

  handleSelect = async choice => {
    // alert("The selection is: " + choice);
    if (choice === "grouping") {
      await this.setState({
        groupingActiveFlag: true,
        talkingActiveFlag: false,
        feelingActiveFlag: false
      });
    } else if (choice === "talking") {
      await this.setState({
        groupingActiveFlag: false,
        talkingActiveFlag: true,
        feelingActiveFlag: false
      });
    } else {
      await this.setState({
        groupingActiveFlag: false,
        talkingActiveFlag: false,
        feelingActiveFlag: false
      });
    }
  };

  render() {
    // console.log("ConnectHub props:", this.props);

    let connectHubButtons = (
      <div>
        <div className="row">
          <div className="col-2 header_store_text text-right">Connect</div>
          <div className="col-10 header_store_buttons">
            <button
              className={`${
                !this.state.groupingActiveFlag
                  ? "btn_connecthub"
                  : "btn_connecthub_active"
              }`}
              type="button"
              onClick={() => this.handleSelect("grouping")}
            >
              <b>Grouping</b>
            </button>
            &nbsp;
            <button
              className={`${
                !this.state.talkingActiveFlag
                  ? "btn_connecthub"
                  : "btn_connecthub_active"
              }`}
              type="button"
              onClick={() => this.handleSelect("talking")}
            >
              <b>Talking</b>
            </button>
            &nbsp;
            <button
              className={`${
                !this.state.feelingActiveFlag
                  ? "btn_connecthub"
                  : "btn_connecthub_active"
              }`}
              type="button"
              onClick={() => this.handleSelect("feeling")}
            >
              <b>Feeling</b>
            </button>
            &nbsp;
            <button
              className="btn-modal_connecthub"
              type="button"
              onClick={this.openAlertModal}
            >
              <i className="fas fa-info-circle" />
            </button>
          </div>
        </div>
      </div>
    );

    
    let groupingOutputPanel;
    
    if (this.props.role === "Creator" || this.props.role === "Admin") {
      groupingOutputPanel = (
        <div>
          <GroupAdmin
            commName={this.props.commName}
            communityid={this.props.communityid}
            goToDashboard={this.props.goToDashboard}
            role={this.props.role}
          />
        </div>
      );
    } else {
      groupingOutputPanel = (
        <div>
          <GroupParticipate
            commName={this.props.commName}
            communityid={this.props.communityid}
            goToDashboard={this.props.goToDashboard}
            role={this.props.role}
          />
        </div>
      );
    }
    // let talkingOutputPanel, feelingOutputPanel;

    let outputPanel;
    if (this.state.groupingActiveFlag) {
      outputPanel = groupingOutputPanel;
    } else {
      outputPanel = (
        <div>
          Not Grouping Panel 
        </div>
      )
    }

    return (
      <div className="fixedsize_connect">
        {connectHubButtons}
        {outputPanel}
        <ModalContainer />
      </div>
    );
  }
}

ConnectHub.propTypes = {
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
)(withRouter(ConnectHub));

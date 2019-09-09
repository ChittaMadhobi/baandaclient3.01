import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import update from "react-addons-update";

// import ReactS3 from "react-s3";
// import axios from "axios";
// import Select from "react-select";

// import _ from "lodash";

import ModalContainer from "../../../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../../../actions/modalActions";
import "../../../../modal/css/localModal.css";
import "../../../../modal/css/template.css";

import Inventory from "./Inventory";
import Pos from "./Pos";

// import cosmicDoorway from "../../market/image/cosmicDoorway.jpg";
// import Select from "react-select";
import "./Store.css";

// const awsAccessKeyId = process.env.REACT_APP_ACCESS_KEY_ID;
// const awsSecretAccessKey = process.env.REACT_APP_SECRET_ACCESS_KEY;
// const awsRegion = process.env.REACT_APP_AWS_REGION;
// const s3BucketName = process.env.REACT_APP_S3_BUCKET_NAME;

// const baandaServer = process.env.REACT_APP_BAANDA_SERVER;

class Store extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",

      posActiveFlag: false,
      poActiveFlag: false,
      inventoryActiveFlag: true,
      financeActiveFlag: false
    };
  }

  // This is to show the info panel
  openAlertModal = () => {
    let msg = {
      Header: "Your Store",
      Body: {
        oneLineSummary: `This has all the information about the activities of the store..`,
        steps: [
          {
            step: "POS (Point 0f Sales)",
            stepNote:
              "At POS, you will be able to sell your items to members of your community. Even if your community is public, one has to join without invite first to buy goods or services."
          },
          {
            step: "Inventory",
            stepNote:
              "This will let you enter, update, inventory of items and prices of your catalog of good and services."
          },
          {
            step: "PO (Purchase Order)",
            stepNote:
              "This will enable you to purchase items, raise purchase orders (if needed), to fill your inventory."
          },
          {
            step: "Finance",
            stepNote:
              "This is for your account paybale and receivable. By default, it is set to receviable. For cash paments, your (creators) acceptance is accepted as received."
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
    if (choice === "POS") {
      await this.setState({
        posActiveFlag: true,
        poActiveFlag: false,
        inventoryActiveFlag: false,
        financeActiveFlag: false
      });
    } else if (choice === "PO") {
      await this.setState({
        posActiveFlag: false,
        poActiveFlag: true,
        inventoryActiveFlag: false,
        financeActiveFlag: false
      });
    } else if (choice === "Inventory") {
      await this.setState({
        posActiveFlag: false,
        poActiveFlag: false,
        inventoryActiveFlag: true,
        financeActiveFlag: false
      });
    } else {
      await this.setState({
        posActiveFlag: false,
        poActiveFlag: false,
        inventoryActiveFlag: false,
        financeActiveFlag: true
      });
    }
  };

  render() {
    //  console.log("Store Props:", this.props);

    let storebuttons = (
      <div>
        <div className="row">
          <div className="col-2 header_store_text text-right">Store</div>
          <div className="col-10 header_store_buttons">
            <button
              className={`${
                !this.state.posActiveFlag
                  ? "btn_store_sm"
                  : "btn_store_sm_active"
              }`}
              type="button"
              onClick={() => this.handleSelect("POS")}
            >
              <b>POS</b>
            </button>
            &nbsp;
            <button
              className={`${
                !this.state.poActiveFlag
                  ? "btn_store_sm"
                  : "btn_store_sm_active"
              }`}
              type="button"
              onClick={() => this.handleSelect("PO")}
            >
              <b>PO</b>
            </button>
            &nbsp;
            <button
              className={`${
                !this.state.inventoryActiveFlag
                  ? "btn_store"
                  : "btn_store_active"
              }`}
              type="button"
              onClick={() => this.handleSelect("Inventory")}
            >
              <b>Inventory</b>
            </button>
            &nbsp;
            <button
              className={`${
                !this.state.financeActiveFlag ? "btn_store" : "btn_store_active"
              }`}
              type="button"
              onClick={() => this.handleSelect("Finance")}
            >
              <b>Finance</b>
            </button>
            &nbsp;
            <button
              className="btn-modal_store"
              type="button"
              onClick={this.openAlertModal}
            >
              <i className="fas fa-info-circle" />
            </button>
          </div>
        </div>
      </div>
    );

    let storePanel;

    if (this.state.inventoryActiveFlag) {
      storePanel = (
        <div>
          <Inventory
            commName={this.props.commName}
            communityid={this.props.communityid}
            goToDashboard={this.props.goToDashboard}
            role={this.props.role}
          />
        </div>
      );
    } else if (this.state.posActiveFlag) {
      storePanel = (
        <div>
          <Pos
            commName={this.props.commName}
            communityid={this.props.communityid}
            goToDashboard={this.props.goToDashboard}
            role={this.props.role}
          />
        </div>
      );
    } else if (this.state.poActiveFlag) {
      storePanel = (
        <div className="text-center">
          <br />
          <br />
          <h4>PO - Purchase Order</h4>
          <div className="row">
            <div className="col-2">&nbsp;</div>
            <div className="col-8">
              <p>Coming Soon - To be published by November 30</p>
            </div>
            <div className="col-2">&nbsp;</div>
          </div>
        </div>
      );
    } else {
      storePanel = (
        <div className="text-center">
          <br />
          <br />
          <h4>Finance (payble & receivable)</h4>
          <div className="row">
            <div className="col-2">&nbsp;</div>
            <div className="col-8">
              <p>Coming Soon - To be published by November 30</p>
            </div>
            <div className="col-2">&nbsp;</div>
          </div>
        </div>
      );
    }

    // storePanel = <div>{storebuttons}</div>;

    return (
      // <div className="fixedsize_store">
      <div>
        {storebuttons}
        {storePanel}
        <div className="bottom-padding" />
        <ModalContainer />
      </div>
    );
  }
}

Store.propTypes = {
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
)(withRouter(Store));

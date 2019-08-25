import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import axios from "axios";

import ModalContainer from "../../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../../actions/modalActions";
import "../../../modal/css/localModal.css";
import "../../../modal/css/template.css";

import Catalog from '../market/catalog/Catalog';
import ViewCatalog from '../market/catalog/ViewCatalog';
import Store from '../market/store/Store';
import ViewStore from '../market/store/ViewStore';

import ConnectHub from '../connect/ConnectHub';

import "./MarketMain.css";

class MarketMain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",

      // Activation module flags
      catalogFlag: true,
      storeFlag: false,
      reportsFlag: false,
      connectFlag: false
    };
  }

  componentWillMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
    this.props.history.goForward();
  }

  goToDashboard = async () => {
    // this.props.history.push("/lobby");
    // this.props.history.push("/dashboard");
    this.props.dashReturnMethod()
  }

  // This is to show the info panel
  openAlertModal = () => {
    let msg = {
      Header: "Your Marketplace",
      Body: {
        oneLineSummary: `This enables you to handle all functions of your marketplace or your store. You can manage your catalog, inventory, see reports and intel, and connect with the user or customer base you are interacting with.`,
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

  handleSelectedFunction = async selected => {
    // alert("Params commName=" + selected);
    if (selected === "catalog") {
      await this.setState({
        catalogFlag: true,
        storeFlag: false,
        reportsFlag: false,
        connectFlag: false
      });
    } else if (selected === "store") {
      await this.setState({
        catalogFlag: false,
        storeFlag: true,
        reportsFlag: false,
        connectFlag: false
      });
    } else if (selected === "reports") {
      await this.setState({
        catalogFlag: false,
        storeFlag: false,
        reportsFlag: true,
        connectFlag: false
      });
    } else if (selected === "connect") {
      await this.setState({
        catalogFlag: false,
        storeFlag: false,
        reportsFlag: false,
        connectFlag: true
      });
    }
  };

  render() {
    console.log("Market props:", this.props);

    // This will handle only catalog portion definitions
    let catalogOutputPanel;
    if (this.props.role === 'Creator' || this.props.role === 'Admin') {
      // catalogOutputPanel = <div><Catalog commName={this.props.commName} communityid={this.props.communityid} goToDashboard={this.props.dashReturnMethod()}/></div>;
      catalogOutputPanel = <div><Catalog commName={this.props.commName} communityid={this.props.communityid} goToDashboard={this.goToDashboard} role={this.props.role}/></div>;
    } else {
      catalogOutputPanel = <div><ViewCatalog /></div>;
    }

    let storeOutputPanel;
    if (this.props.role === 'Creator' || this.props.role === 'Admin') {
      // catalogOutputPanel = <div><Catalog commName={this.props.commName} communityid={this.props.communityid} goToDashboard={this.props.dashReturnMethod()}/></div>;
      storeOutputPanel = <div><Store commName={this.props.commName} communityid={this.props.communityid} goToDashboard={this.goToDashboard} role={this.props.role}/></div>;
    } else {
      storeOutputPanel = <div><ViewStore /></div>;
    }

    let connectOutputPanel = <div><ConnectHub commName={this.props.commName} communityid={this.props.communityid} goToDashboard={this.goToDashboard} role={this.props.role}/></div>;
    

    // activePanel will invoke the module that is clicked on.
    let activePanel;
    if (this.state.catalogFlag) {
      activePanel = catalogOutputPanel;
    } else if (this.state.storeFlag) {
      activePanel = storeOutputPanel;
    } else if (this.state.reportsFlag) {
      activePanel = <div>Reports</div>;
    } else if (this.state.connectFlag) {
      activePanel = <div>{connectOutputPanel}</div>;
    }

    let marketLandingPanel = (
      <div>
        <div className="row page-top">
          {/* <div className="col-6 access_list_header">Engagements</div> */}
          <div className="col market_header_spacing">
            <button
              className={`${
                this.state.catalogFlag
                  ? "btn_top_market_active"
                  : "btn_top_market_passive"
              }`}
              //   className="btn_top_market_active"
              type="button"
              onClick={() => this.handleSelectedFunction("catalog")}
            >
              <b>Catalog</b>
            </button>
            &nbsp; 
            <button
              className={`${
                this.state.storeFlag
                  ? "btn_top_market_active"
                  : "btn_top_market_passive"
              }`}
              type="button"
              onClick={() => this.handleSelectedFunction("store")}
            >
              <b>Store</b>
            </button>
            &nbsp;
            <button
              className={`${
                this.state.reportsFlag
                  ? "btn_top_market_active"
                  : "btn_top_market_passive"
              }`}
              type="button"
              onClick={() => this.handleSelectedFunction("reports")}
            >
              <b>Reports</b>
            </button>
            &nbsp; 
            <button
              className={`${
                this.state.connectFlag
                  ? "btn_top_market_active"
                  : "btn_top_market_passive"
              }`}
              type="button"
              onClick={() => this.handleSelectedFunction("connect")}
            >
              <b>Connect</b>
            </button>
            &nbsp; 
            <button
              className="btn-modal_market"
              type="button"
              onClick={this.openAlertModal}
            >
              <b>Info</b>
            </button>
            &nbsp; 
            <button
              className="btn-back"
              type="button"
              onClick={this.goToDashboard}
            >
              <i className="fas fa-step-backward" />
              {/* <b>Back</b> */}
            </button>
          </div>
        </div>
        {activePanel}
        <ModalContainer />
      </div>
    );

    return <div className="text-center">{marketLandingPanel}</div>;
  }
}

MarketMain.propTypes = {
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

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketMain));

// export default MarketMain;

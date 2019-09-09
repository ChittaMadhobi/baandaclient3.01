import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import ModalContainer from "../../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../../actions/modalActions";
import "../../../modal/css/localModal.css";
import "../../../modal/css/template.css";

// Navigation imports
import Market from '../market/MarketMain';


import "./Dashboard.css";

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const getAccessList = "/routes/dashboard/getAccessList?"; // This is a GET

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: this.formatDate(),
      dashMsg: "Please select the item you would like to engage in.",
      dashMsgFlag: true, // Meaning, no error or empty lists (false to be displayed in red)
      accessList: [],
      list: [],

      commName: '',
      communityid: 0,
      role: '',
      
      // active panel flags
      accessListPanelFlag: true,
      marketFlag: false
    };
  }
  openAlertModal = () => {
    let msg = {
      Header: "Engage - Your Communities",
      Body: {
        oneLineSummary: `The list shows the communities you created, adminster or participate. <${
          this.state.date
        }> personality overview based on Big-5 (OCEAN) technique. This is a widely used, and vetted technique including adopted by intelligence communities around  the world. This has been tested to transcend culturs, values and seems to be aligned to ones DNA.`,
        steps: [
          {
            step: "1: Identify",
            stepNote:
              "Identify the community you want to work on (your interest now)."
          },
          {
            step: "2: Proceed to enagage",
            stepNote:
              "Click Go> buttton to enter into the selected community realm."
          }
        ],
        footnote:
          "In the begining, the access list shows latest community (by date) you have created, adminster, or joined. Coming soon when you can filter and order the access list and set that as your default."
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

  formatDate = () => {
    var date = new Date();
    var aaaa = date.getFullYear();
    var gg = date.getDate();
    var mm = date.getMonth() + 1;

    if (gg < 10) gg = "0" + gg;

    if (mm < 10) mm = "0" + mm;

    var cur_day = aaaa + "-" + mm + "-" + gg;

    // var hours = date.getHours()
    // var minutes = date.getMinutes()
    // var seconds = date.getSeconds();

    // if (hours < 10)
    //     hours = "0" + hours;

    // if (minutes < 10)
    //     minutes = "0" + minutes;

    // if (seconds < 10)
    //     seconds = "0" + seconds;

    // return cur_day + " " + hours + ":" + minutes + ":" + seconds;

    return cur_day;
  };

  // to be filled out if needed
  componentDidMount = async () => {
    // console.log("I am in component Did Mount ... calling loadList");
    await this.loadList();
  };

  async componentWillUnmount() {
    // console.log("I am in component will mount");
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
    this.props.history.goForward();
  }

  loadList = async () => {
    let url =
      baandaServer +
      getAccessList +
      "baandaid=" +
      this.props.auth.user.baandaId;
    // console.log("loadList url:", url);
    try {
      let retData = await axios.get(url);

      if (retData.data.length === 0) {
        throw new Error(
          `Empty access list. Please join or create a community first.`
        );
      } else {
        // console.log("ret msg:", retData.data);
        let noOfRecs = retData.data.length;
        let value;
        for (var i = 0; i < noOfRecs; i++) {
          value = {
            commName: retData.data[i].commName,
            communityId: retData.data[i].communityId,
            commCaption: retData.data[i].commCaption,
            intent: retData.data[i].intent,
            intentFocus: retData.data[i].intentFocus,
            role: retData.data[i].role
          };
          this.addToAccessList(value);
        }
      }
    } catch (err) {
      console.log("err:", err.message);
      await this.setState({
        dashMsg: err.message,
        dashMsgFlag: true
      });
      // ifExists = false;
    }
  };

  addToAccessList = value => {
    // console.log('addToAccessList value:', value );
    this.setState(state => {
      const accessList = [...state.accessList, value];
      return { accessList };
    });
  };

  handleShowPersona = () => {
    this.props.history.push("/mirror");
  };

  // Handle navigation based on selection of intent and focus. 
  handleSelectedCommunity = async (commName, communityid, role, intent, focus) => {
    // console.log("Params commName=" , commName , " CommunityId=", communityid , " role=", role,  " intent=" , intent , " focus=" , focus);
    if ( intent === 'Business' && focus === 'Catalog') {
      await this.setState({
        accessListPanelFlag: false,
        marketFlag: true,
        commName: commName,
        communityid: communityid,
        role: role
      })
    }
  };

  returnToDashboard = async () => {
    // alert( 'Returned to dashboard');
    await this.setState({
      accessListPanelFlag: true,
      marketFlag: false
    })
  }

  render() {
    // console.log("Dashboard this.props: ", this.props);
    // console.log("Dashboard this.state:", this.state);
    // console.log("this.state.list:", list);

    // Engage Landing Module list.
    let itemListPanel;
    // colorFlag toggles between two colors of the list to display
    let colorflag = true;
    itemListPanel = (
      <div>
        {/* <div className="text-center access_list_header">Engagements</div> */}
        <small className="text-center">
          <i>Click 'Go >' button to enter your selection.</i>
        </small>
        <div className="header-spacing" />
        <div className="row">
          <div className="col-11 text-center selection_header_font">
            Your Communities
          </div>
          <div className="col-1">&nbsp;</div>
        </div>
        <hr className="header_hr" />
        <div className="fixedsize_dash">
          {this.state.accessList.map((item, i) => (
            <div key={i}>
              {/* <p>{item.commName} &nbsp;  */}
              <div className={`${colorflag ? "dark-row" : "light-row"}`}>
                <div className="row text-left">
                  {/* <div className="col-2">{item.commName}</div> */}
                  <div className="col-10 caption_bold">{item.commCaption}</div>
                  {/* <div className="col-2 text-left">
                    |{item.intentFocus}
                  </div> */}
                  <div className="col-2">
                    <button
                      className="btn_access_list"
                      type="button"
                      onClick={() =>
                        this.handleSelectedCommunity(
                          item.commName,
                          item.communityId,
                          item.role,
                          item.intent,
                          item.intentFocus
                        )
                      }
                    >
                      Go <i className="fas fa-greater-than" />
                    </button>
                  </div>
                </div>
              </div>

              {(colorflag = !colorflag)}
            </div>
          ))}
        </div>
      </div>
    );
    let engageLandingPanel = (
      <div>
        <div className="row page-top">
          <div className="col-6 access_list_header">Engagements</div>
          <div className="col-6">
            <button
              className="btn_mirror_dash"
              type="button"
              onClick={this.handleShowPersona}
            >
              <b>Mirror</b>
            </button>
            &nbsp;
            <button
              className="btn-modal_dash"
              type="button"
              onClick={this.openAlertModal}
            >
              <b>Info</b>
            </button>
          </div>
        </div>
        {itemListPanel}
        <ModalContainer />
      </div>
    );

    // This is your store, market for handling catalog, inventory, this.connects, intel etc. All for the community you selected. 
    let marketPanel = (
      <div>
        <Market commName={this.state.commName} communityid={this.state.communityid} role={this.state.role} dashReturnMethod={this.returnToDashboard}/>
      </div>
    )

    let outputPanel;
    if (this.state.accessListPanelFlag) {
      outputPanel = engageLandingPanel;
    } else if (this.state.marketFlag) {
      outputPanel = marketPanel;
    }
    return (
      <div className="text-center">
        {outputPanel}
      </div>
    );
  }
}  

Dashboard.propTypes = {
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
)(Dashboard);s
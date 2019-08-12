import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import ModalContainer from "../../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../../actions/modalActions";
import "../../../modal/css/localModal.css";
import "../../../modal/css/template.css";

// import InitialProfile from '../../../intelligence/components/persona/InitialProfile';

import "./Dashboard.css";

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const getAccessList = "/routes/dashboard/getAccessList?"; // This is a GET

let list = [];

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: this.formatDate(),
      dashMsg: "Please select the item you would like to engage in.",
      dashMsgFlag: true, // Meaning, no error or empty lists (false to be displayed in red)
      accessList: [],
      list: []
    };
  }
  openAlertModal = () => {
    let msg = {
      Header: "Engage - Your Dashboard",
      Body: {
        oneLineSummary: `This is your today's <${
          this.state.date
        }> personality overview based on Big-5 (OCEAN) technique. This is a widely used, and vetted technique including adopted by intelligence communities around  the world. This has been tested to transcend culturs, values and seems to be aligned to ones DNA.`,
        steps: [
          {
            step: "O: (Openness vs. Closed to experience)",
            stepNote:
              "This includes Ideas(curious), Fantasy(imaginative), Aesthetics(artistic) Actions(wide interests), Feelings(exciteable), Values(unconventional)"
          },
          {
            step: "C: (Conscientiousness vs. Lack of direction)",
            stepNote:
              "Competence(efficient), Order(organized), Dutifulness(not careless), Achievement striving(through), Self-discipline(not lazy), Deliberation(not impulsive)"
          },
          {
            step: "E: (Extraversion vs. Introversion)",
            stepNote:
              "Gregariousness(sociable), Assertiveness(forceful), Activity(energetic) Excitement-seeking(adventerous), Positive emotions(enthusistic), Warmth(outgoing)"
          },
          {
            step: "A: (Agreeable vs. Antagonism)",
            stepNote:
              "Trust(forgiving), Straightforwardness(not demanding), Altruism(warm), Compliance(not stubborn), Modesty(not show-off), Tender-mindedness(sympathetic)"
          },
          {
            step: "N: (Neuroticism vs. Emotional Stability)",
            stepNote:
              "Anxiety(tense), Angry hostility(irritable), Depression(not contented), Self-consciousness(shy), Impulsiveness(moody), Vulnarability(not self-confident)"
          }
        ],
        footnote:
          "Big-5 persona assessment is assumed to be closely related to your DNA. It's manifestation is influenced by your environment."
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
    console.log("I am in component Did Mount ... calling loadList");
    await this.loadList();
  };

  componentWillUnmount() {
    console.log("I am in component will mount");
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
    console.log("loadList url:", url);
    try {
      let retData = await axios.get(url);

      if (retData.data.length === 0) {
        throw new Error(
          `Empty access list. Please join or create a community first.`
        );
      } else {
        console.log("ret msg:", retData.data);
        let noOfRecs = retData.data.length;
        let value;
        for (var i = 0; i < noOfRecs; i++) {
          value = {
            commName: retData.data[i].commName,
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

  testClick = (v1, v2, v3) => {
    alert("Params v1=" + v1 + " v2=" + v2 + "v3=" + v3);
  };
  render() {
    console.log("Dashboard this.props: ", this.props);
    console.log("this.state.accessList:", this.state.accessList);
    console.log("this.state.list:", list);

    let itemListPanel;
    let colorflag = true;
    // let rowcolor=true;
    itemListPanel = (
      <div>
        {/* <div className="text-center access_list_header">Engagements</div> */}
        <small className="text-center"><i>Click 'Go >' button to enter your selection.</i></small>
        <div className="header-spacing" />
        <div className="row">
          <div className="col-11 text-center selection_header_font">
            Your Communities
          </div>
          <div className="col-1">&nbsp;</div>
        </div>
        <hr className="header_hr"/>
        <div className="fixedsize_dash">
          {this.state.accessList.map((item, i) => (
            <div key={i}>
              {/* <p>{item.commName} &nbsp;  */}
              <div className={`${colorflag ? "dark-row" : "light-row"}`}>
                <div className="row text-left">
                  {/* <div className="col-2">{item.commName}</div> */}
                  <div className="col-10 caption_bold">
                    {item.commCaption}
                  </div>
                  {/* <div className="col-2 text-left">
                    |{item.intentFocus}
                  </div> */}
                  <div className="col-2">
                    <button
                      className="btn_access_list"
                      type="button"
                      onClick={() =>
                        this.testClick(
                          item.commName,
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

    return (
      <div className="text-center">
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
)(Dashboard);
// export default dashboard;

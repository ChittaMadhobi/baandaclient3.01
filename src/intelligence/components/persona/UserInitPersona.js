import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import ModalContainer from "../../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../../actions/modalActions";
import "../../../modal/css/localModal.css";
import "../../../modal/css/template.css";
import { setQAInitDone } from "../../../actions/authActions";

import ReactLoading from "react-loading";

import { personaCalc } from "../../calculations/personaCalc";


import "./UserInitPersona.css";
// stripeKey={process.env.REACT_APP_STRIPE_KEY}
const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const PERSONA_QUESTION_API_POST = "/routes/users/getUserPersonaQ";
let userData = {};
// let slider = []; // Persona Initial Questions

class UserInitPersona extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      isLoading: false,
      allQuestionsAnsweredFlag: false,
      showPersonaReport: false,
      pqa_msg:
        "Please score all quations to procees. No score should be zero (0)."
      // INITIAL_STATE
    };
  }

  openAlertModal = param => e => {
    // console.log("param : " + param + " user:" + this.props.auth.user.name);
    // let msg = 'This could be Jit ID: ' + param
    let msg = {
      Header: "First Impression - Persona & Profile",
      Body: {
        oneLineSummary:
          "Here I begin to know you so I can serve you uniquely as a special and  uniqe individual that you are.",
        steps: [
          {
            step: "Step 1: ",
            stepNote:
              "For each question, use the slide scale to answer. Low score (1) means you strongly disagree and high-score (10) means you strongly agree."
          },
          {
            step: "Step 2: ",
            stepNote:
              "I will assess your geo-location from your current position. You would be able to assign a geo-location with reference to the center of your activities when you create communities or join one."
          },
          {
            step: "Core Idea: ",
            stepNote:
              "This is a starting point to knowing you. Think of me like your doctor, lawyer, councilor, a friend. More genuin you are, more I would be able to assist you that will fit the unique you."
          }

          // {
          //   step: "Step 3: ",
          //   stepNote:
          //     "Add some of you basic values and cultural nuances of your life."
          // }
        ],
        footnote:
          "More genuine you are, better I would be able to assist you. None of your information will be shared with anyone unless you explicitly ask me to (Baanda promise). Think, as if you just met me and sharing me about your inner being (persona). Progressively, I will try to know more of your spirit and assist you uiquely and become your assistance and friend (your baanda)."
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
  // Try to see if backbutton cannot be used. 
  UNSAFE_componentWillUnmount() {
    this.props.history.goForward();
  }

  async componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      // Do this only if users's isInitDone is false.
      if (!this.props.auth.user.isInitDone) {
        await this.addToSlider(this.props.auth.user.baandaId);
      } else {
        // Go to lobby. Excepting from the URL manipulation, flow should not even reach here from lobby.
        this.props.history.push("/lobby");
      }
    } else {
      // console.log("Go to login page");
      this.props.history.push("/login");
    }
  }

  addItem = value => {
    this.setState(state => {
      const list = [...state.list, value];
      return { list };
    });
  };

  addToSlider = async baandaid => {
    let url =
      baandaServer + PERSONA_QUESTION_API_POST + "?baandaid=" + baandaid;
      // console.log('UserInitPersona addToSlider url: ', url);
    try {
      let value;
      let retdata = await axios.get(url);
      // console.log('UserInitPersona addToSlider getQuestion retData: ', retdata);
      if (retdata.data) {
        let noOfRecs = retdata.data.length;
        for (var i = 0; i < noOfRecs; i++) {
          value = {
            seq_no: retdata.data[i].seq_no,
            q: retdata.data[i].question,
            v: retdata.data[i].score,
            inversion_flag: retdata.data[i].inversion_flag,
            persona_category: retdata.data[i].persona_category
          };
          this.addItem(value);
        }
        return retdata.data;
      } else {
        throw new Error(
          "Did not receive questions from server. Please report to info@baanda.com"
        );
      }
    } catch (error) {
      console.log("Error: (from UserInitPersona) ", error);
      return false;
    }
  };

  handleChangeSlide = e => {
    let id = e.target.id;
    let val = e.target.value;

    this.setState(state => {
      let tempitem;
      const list = state.list.map((item, k) => {
        if (parseInt(id) - 1 === k) {
          // console.log('id=', id, ' k:', k, ' val=', val, ' item:', item );
          tempitem = {
            seq_no: item.seq_no,
            q: item.q,
            v: parseInt(val),
            inversion_flag: item.inversion_flag,
            persona_category: item.persona_category
          };
          return tempitem;
        } else {
          return item;
        }
      });
      return { list };
    });
  };

  handleWIPSave = async () => {
    let retVal = await personaCalc(
      this.props.auth.user.baandaId,
      this.state.list
    );
    // console.log("retVal:", retVal);
    if (!retVal.status) {
      this.setState({
        pqa_msg:
          "You have " +
          retVal.noLeft +
          " questions left to complete. To continue later, click home from navbar or complete and click Save again."
      });
    } else {
      // Trying to call action -> reducer to update store's isInitDone=true
      userData = this.props.auth.user;
      this.props.setQAInitDone();

      this.setState({
        pqa_msg:
          "Thank you for completing. Click Mirror button for the first impression. This will be available in your Engage panel.",
        allQuestionsAnsweredFlag: true
      });
    }
  };

  handleShowPersona = () => {

    // mirror will show the current persona from here and from dashboard.
    // this.props.history.push("/mirror");
    this.props.history.push("/mirror");
  };
 
  render() {
    console.log("UserInitPersona.js this.props:", this.props);
    console.log("UserInitPersona.js this.state:", this.state);

    let loading;
    if (this.state.isLoading) {
      loading = (
        <div className="row">
          <div className="col-5 text-right">Loading questions</div>
          <div className="col-2">
            <ReactLoading
              type={"spokes"}
              color={"#195670"}
              height={30}
              width={30}
            />
          </div>
          <div className="col-5 text-left">... please wait</div>
        </div>
      );
    }

    let buttonPanel;
    if (!this.state.allQuestionsAnsweredFlag) {
      // WIP button
      buttonPanel = (
        <div>
          <div className="row">
            <div className="col-8 pqa_msg">
              <p align="justify">{this.state.pqa_msg}</p>
            </div>
            <div className="col-4">
              <button
                className="btn_pqa"
                type="button"
                onClick={this.handleWIPSave}
              >
                <b>Save</b>
              </button>
            </div>
          </div>
          <div className="pqa_btn_space" />
        </div>
      );
    } else {
      buttonPanel = (
        <div>
          <div className="row">
            <div className="col-8 pqa_msg">
              <p align="justify">{this.state.pqa_msg}</p>
            </div>
            <div className="col-4">
              <button
                className="btn_pqa"
                type="button"
                onClick={this.handleShowPersona}
              >
                <b>Mirror</b>
              </button>
            </div>
          </div>
          <div className="pqa_btn_space" />
        </div>
      );
    }

    let qpanel = (
      <div className="fixedsize_scroll">
        {this.state.list.map((item, i) => (
          <div key={i}>
            <div className="question-text">
              {item.seq_no}.&nbsp;{item.q}{" "}
            </div>
            <div className="slidecontainer">
              <input
                id={item.seq_no}
                type="range"
                min="0"
                max="10"
                onChange={this.handleChangeSlide}
                step="1"
                value={item.v}
                className="slider"
              />{" "}
              &nbsp;
              <font size="3">
                <b>{item.v}</b>
              </font>
            </div>
          </div>
        ))}
        <hr />
        {buttonPanel}
      </div>
    );

    return (
      <div className="container text-center">
        <div className="row page-top">
          <div className="col-3">&nbsp;</div>
          <div className="col-6">
            <div className="qa_header">Your Personality</div>
          </div>
          <div className="col-3">
            <button
              className="btn-modal"
              type="button"
              onClick={this.openAlertModal("canSendParmForMultipleModal")}
            >
              <b>What is this?</b>
            </button>
          </div>
        </div>
        {loading}
        <div className="row table_header">
          <div className="col-3 text-left">
            <font color="#ed1111">
              <b>Disagree</b>
            </font>
          </div>
          <div className="col-6 text-left">
            <font color="black">
              <b>Read as: I ...</b>
            </font>
          </div>
          <div className="col-3 text-right">
            <font color="#45590b">
              <b>Agree</b>
            </font>
          </div>
        </div>
        {qpanel}
        <ModalContainer />
      </div>
    );
  }
}

UserInitPersona.propTypes = {
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
  },
  setQAInitDone: () => dispatch(setQAInitDone(userData))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInitPersona);

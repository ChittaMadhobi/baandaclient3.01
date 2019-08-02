import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
// import axios from "axios";

import ModalContainer from "../../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../../actions/modalActions";
import "../../../modal/css/localModal.css";
import "../../../modal/css/template.css";

// import InitialProfile from '../../../intelligence/components/persona/InitialProfile';

import "./Dashboard.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: this.formatDate()
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
  componentDidMount() {
    
  }

  componentWillUnmount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
    this.props.history.goForward();
  }

  handleShowPersona = () => {
    this.props.history.push("/mirror");
  };

  render() {
    console.log("Dashboard this.props: ", this.props);

    // let initProfilePanel;

    // if (!this.props.auth.user.isInitPersonalInfoDone) {
    //   initProfilePanel = (
    //     <div>
    //       <InitialProfile />
    //     </div>
    //   )
    // }
    return (
      <div className="text-center">
        <div className="row page-top">
          <div className="col-6 dash_header">Engage - Your Dashboard</div>
          <div className="col-6">
            <button
              className="btn_mirror_dash"
              type="button"
              onClick={this.handleShowPersona}
            >
              <b>Mirror Mirror</b>
            </button>
            &nbsp;
            <button
              className="btn-modal_dash"
              type="button"
              onClick={this.openAlertModal}
            >
              <b>What is this?</b>
            </button>
          </div>
        </div>
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
  },
  // setQAInitDone: () => dispatch(setQAInitDone(userData))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
// export default dashboard;

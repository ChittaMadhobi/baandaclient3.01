import React, { Component } from "react";
import Radar from "react-d3-radar";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import ModalContainer from "../../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../../actions/modalActions";
import "../../../modal/css/localModal.css";
import "../../../modal/css/template.css";

import "./ShowPersona.css";

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const PERSONA_SCORES_GET = "/routes/shared/getPersonaScores";

class ShowPersona extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: this.formatDate(),
      personaScore: {},
      labelO: "",
      labelC: "",
      labelE: "",
      labelA: "",
      labelN: "",
      O: 0,
      C: 0,
      E: 0,
      A: 0,
      N: 0
    };
  }

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
  // This is where data initialization should be.
  async componentDidMount() {
    try {
      let scores = await this.getPersonaScores(this.props.auth.user.baandaId);
      if (!scores) {
        throw new Error(
          "No persona scores returned for baandaid:" +
            this.props.auth.user.baandaId
        );
      }
      // console.log("persona:", scores.data.personalInfo.persona.A);
      this.setStateForSpider(scores.data.persona);
    } catch (err) {
      console.log("didMount err:", err);
    }
    // console.log("this.state.date:", this.state.date);
  }

  // For mitigating back button
  componentWillUnmount() {
    this.props.history.goForward();
  }

  // Get the persona scores from DB

  setStateForSpider = scores => {
    this.setState({
      labelO: "Openess (" + scores.O + "%)",
      labelC: "Conscientious (" + scores.C + "%)",
      labelE: "Extraversion (" + scores.E + "%)",
      labelA: "Agreeableness (" + scores.A + "%)",
      labelN: "Neuroticism (" + scores.N + "%)",
      O: scores.O,
      C: scores.C,
      E: scores.E,
      A: scores.A,
      N: scores.N
    });
  };

  getPersonaScores = async baandaid => {
    let url = baandaServer + PERSONA_SCORES_GET + "?baandaid=" + baandaid;
    let retdata;
    try {
      retdata = await axios.get(url);
      console.log("retdata.data:", retdata);
    } catch (err) {
      console.log("Error:", err);
    }
    return retdata;
  };

  handleDone = () => {
    this.props.history.push("/lobby");
  };

  openAlertModal = () => {
    // let date = Date.now();
    // let dateToday = date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear();
    // console.log("param : " + param + " user:" + this.props.auth.user.name);
    // let msg = 'This could be Jit ID: ' + param
    let msg = {
      Header: "Mirror Mirror",
      Body: {
        oneLineSummary: `This is your today's <${
          this.state.date
        }> personality overview based on Big-5 (OCEAN) technique; this is a widely used, and vetted technique including adopted by intelligence communities around  the world. This has been tested to transcend culturs, values and seems to be aligned to ones DNA.`,
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

  render() {
    console.log('Show Persona props:', this.props);
    let personaChart;

    personaChart = (
      <div>
        <Radar
          width={300}
          height={300}
          padding={40}
          domainMax={100}
          highlighted={null}
          onHover={point => {
            if (point) {
              console.log("hovered over a data point");
            } else {
              console.log("not over anything");
            }
          }}
          data={{
            variables: [
              { key: "O", label: this.state.labelO },
              { key: "C", label: this.state.labelC },
              { key: "E", label: this.state.labelE },
              { key: "A", label: this.state.labelA },
              { key: "N", label: this.state.labelN }
            ],
            sets: [
              {
                key: "me",
                label: "My Scores",
                values: {
                  O: this.state.O,
                  C: this.state.C,
                  E: this.state.E,
                  A: this.state.A,
                  N: this.state.N
                }
              }
            ]
          }}
        />
      </div>
    );

    return (
      <div className="text-center">
        <div className="row">
          <div className="col-3 date-size">{this.state.date}</div>
          <div className="col-6 heading_text">Personality Mirror</div>
          <div className="col-3">
            <button
              className="btn_perona_modal"
              type="button"
              onClick={this.openAlertModal}
            >
              Explain
            </button>
          </div>
        </div>
        <div className="fixedsize-persona">
          <div className="row">
            <div className="col">
              <div className="chart_size chart_position">{personaChart}</div>
            </div>
          </div>

          <hr />
          <div className="row">
            <div className="col-1">&nbsp;</div>
            <div className="col-10">
              <div className="message_text">
                <p align="justify">
                  <b>
                    <font color="blue">O</font>pen-Mindedness. &nbsp;&nbsp;
                    (Your percentile: {this.state.O})
                  </b>{" "}
                </p>
                <p align="justify">
                  High scorers tend to be original, creative, curious, complex;
                  Low scorers tend to be conventional, down to earth, narrow
                  interests, uncreative.
                </p>
              </div>
            </div>
            <div className="col-1">&nbsp;</div>
          </div>

          <div className="row">
            <div className="col-1">&nbsp;</div>
            <div className="col-10">
              <div className="message_text">
                <p align="justify">
                  <b>
                    <font color="blue">C</font>onscientiousness. &nbsp;&nbsp;
                    (Your percentile: {this.state.C})
                  </b>{" "}
                </p>
                <p align="justify">
                  High scorers tend to be reliable, well-organized,
                  self-disciplined, careful; Low scorers tend to be
                  disorganized, undependable, negligent.
                </p>
              </div>
            </div>
            <div className="col-1">&nbsp;</div>
          </div>

          <div className="row">
            <div className="col-1">&nbsp;</div>
            <div className="col-10">
              <div className="message_text">
                <p align="justify">
                  <b>
                    <font color="blue">E</font>xtraversions. &nbsp;&nbsp; (Your
                    percentile: {this.state.E})
                  </b>{" "}
                </p>
                <p align="justify">
                  High scorers tend to be sociable, friendly, fun loving,
                  talkative; Low scorers tend to be introverted, reserved,
                  inhibited, quiet.
                </p>
              </div>
            </div>
            <div className="col-1">&nbsp;</div>
          </div>
          <div className="row">
            <div className="col-1">&nbsp;</div>
            <div className="col-10">
              <div className="message_text">
                <p align="justify">
                  <b>
                    <font color="blue">A</font>greeableness. &nbsp;&nbsp; (Your
                    percentile: {this.state.A})
                  </b>{" "}
                </p>
                <p align="justify">
                  High scorers tend to be good natured, sympathetic, forgiving,
                  courteous; Low scorers tend to be critical, rude, harsh,
                  callous.
                </p>
              </div>
            </div>
            <div className="col-1">&nbsp;</div>
          </div>
          <div className="row">
            <div className="col-1">&nbsp;</div>
            <div className="col-10">
              <div className="message_text">
                <p align="justify">
                  <b>
                    <font color="blue">N</font>eagative Emotionality.
                    &nbsp;&nbsp; (Your percentile: {this.state.N})
                  </b>{" "}
                </p>
                <p align="justify">
                  High scorers tend to be nervous, high-strung, insecure,
                  worrying; Low scorers tend to be calm, relaxed, secure, hardy.
                </p>
              </div>
            </div>
            <div className="col-1">&nbsp;</div>
          </div>
          <hr />

          <div className="row">
            <div className="col-1">&nbsp;</div>
            <div className="col-8 bottom_message_text">
              <p align="justify">
                Click 'Done' button post review. The Mirror button will be
                available in your Home->Engage for increasingly finer and
                time-sensetive reflection of your self.
              </p>
            </div>
            <div className="col-2">
              <button
                className="btn_done"
                type="button"
                onClick={this.handleDone}
              >
                Done
              </button>
            </div>
            <div className="col-1">&nbsp;</div>
          </div>
        </div>
        <hr />              
        <ModalContainer />
      </div>
    );
  }
}

ShowPersona.propTypes = {
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowPersona);

// export default ShowPersona;

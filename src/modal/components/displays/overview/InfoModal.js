import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { hideModal } from "../../../../actions/modalActions";
import "../../../css/localModal.css";
import "./InfoModal.css";

class InfoModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todotext: ""
    };

    this.closeModal = this.closeModal.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  closeModal(e) {
    e.preventDefault();
    // console.log("closeModal.func : " + this.state.todotext);
    const modTask = {
      todotext: this.state.todotext
    };

    this.props.hideModal(modTask);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    console.log("props InfoModal:" + JSON.stringify(this.props.message));
    const header = this.props.message.Header;

    const steps = this.props.message.Body.steps;
    console.log("steps len:", steps.length);

    let summary, step1, step1Msg, step2, step2Msg, step3, step3Msg, step4, step4Msg, footnote;
    if (this.props.message.Body.oneLineSummary) {
      summary = this.props.message.Body.oneLineSummary;
    }
    if (this.props.message.Body.steps[0]) {
      step1 = this.props.message.Body.steps[0].step;
      step1Msg = this.props.message.Body.steps[0].stepNote;
    }
    if (this.props.message.Body.steps[1]) {
        step2 = this.props.message.Body.steps[1].step;
        step2Msg = this.props.message.Body.steps[1].stepNote;
    }
    if (this.props.message.Body.steps[2]) {
        step3 = this.props.message.Body.steps[2].step;
        step3Msg = this.props.message.Body.steps[2].stepNote;
    }
    if (this.props.message.Body.steps[3]) {
        step4 = this.props.message.Body.steps[3].step;
        step4Msg = this.props.message.Body.steps[3].stepNote;
    }

    footnote = this.props.message.Body.footnote;
    

    console.log(
      "summary:",
      summary,
      " step1:",
      step1,
      " step1Msg:",
      step1Msg,
      " step2:",
      step2,
      "step2Msg",
      step2Msg,
      " step3:",
      step3,
      " step3Msg:",
      step3Msg,
      " step4:",
      step4,
      " step4Msg:",
      step4Msg,
      " footnote:",
      footnote
    );

    return (
      <div className="container">
        <div className="modal-content-z">
          <div className="row text-center justify-content-center">
            <div className="modal-header-text">
              {/* Overview of header here ...{" "} */}
              <font color="black">{header}</font>
            </div>
          </div>

          <div className="modal-body">
            <div className="fixedsize-start-here">
              {/* <div className="text-center">
                <font color="white" size="3">
                  <b>Info Modal </b>
                </font>
              </div> */}

              <div className="row">
                <div className="col-12">
                  <div className="start-here-msg">
                    <font color="white">
                      <p align="justify" className="notes-text">
                        {summary}
                      </p>
                    </font>
                    <font color="#ededd1">  
                      <p align="justify" className="notes-text">
                        <b>{step1}</b>{step1Msg}
                      </p>
                      <p align="justify" className="notes-text">
                        <b>{step2}</b>{step2Msg}
                      </p>
                      <p align="justify" className="notes-text">
                        <b>{step3}</b>{step3Msg}
                      </p>
                      <p align="justify" className="notes-text">
                        <b>{step4}</b>{step4Msg}
                      </p>

                    </font>
                    <font color="#abd9ed">
                      Notes:&nbsp;
                      <p align="justify" className="notes-text">
                        {footnote}
                      </p>
                    </font>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={this.closeModal}
              onChange={this.onChange}
            >
              <strong>Close</strong> &nbsp;
              <div className="float-right">
                <i className="far fa-window-close" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

InfoModal.propTypes = {
  hideModal: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { hideModal }
)(InfoModal);

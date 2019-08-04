import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import axios from "axios";

import ModalContainer from "../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../actions/modalActions";
import "../../modal/css/localModal.css";
import "../../modal/css/template.css";

import Select from "react-select";
import { optionsIntent } from "./data/selectOptions";
import { optionsBizIntent } from "./data/bizOptions";
import { optionsColiveIntent } from "./data/coliveOptions";
import { optionsFunstuffIntent } from "./data/funstuffOptions";

import "./NewCreation.css";

class NewCreation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      commName: "", // input text  5 to 20 chars
      commCaption: "", // input text 15 - to 50
      commDescription: "", // input textarea 50 to 1000 chars
      joinProcess: "Private", // Radio Button
      searchWords: [], // String, comma dellimited, max
      intent: "", // This is drop down
      subIntent: "",
      fileUploads: [
        {
          name: "",
          dispCaption: "",
          contentType: "", // audio, video, document
          s3Url: ""
        }
      ]
    };

    this.onChange = this.onChange.bind(this);
    this.handleJoinProcess = this.handleJoinProcess.bind(this);
  }

  async onChange(e) {
    // console.log('onChange: ', e.target.name, ' value:', e.target.value);
    await this.setState({ [e.target.name]: e.target.value });
  }

  async handleJoinProcess(e) {
    await this.setState({
      joinProcess: e.target.value
    });
  }

  handleIntent = async (selectedOption, { action }) => {
    await this.setState({
      intent: selectedOption
    });
  };
  handleSubIntent = async (selectedOption, { action }) => {
    await this.setState({
      subIntent: selectedOption
    });
  };

  render() {
    console.log("this.state: ", this.state);
    console.log("Intent:", this.state.intent.value);
    let topInputPanel;
    let subIntentPanel=null;;
    if (this.state.intent.value === "Business") {
      subIntentPanel = (
        <div>
          <Select
            value={this.state.subIntent}
            options={optionsBizIntent}
            className="intent-select"
            classNamePrefix="select"
            onChange={this.handleSubIntent}
          />
        </div>
      );
    } else if (this.state.intent.value === "Co-live") {
      subIntentPanel = (
        <div>
          <Select
            value={this.state.subIntent}
            options={optionsColiveIntent}
            className="intent-select"
            classNamePrefix="select"
            onChange={this.handleSubIntent}
          />
        </div>
      );
    } else if (this.state.intent.value === "Fun-Stuff") {
      subIntentPanel = (
        <div>
          <Select
            value={this.state.subIntent}
            options={optionsFunstuffIntent}
            className="intent-select"
            classNamePrefix="select"
            onChange={this.handleSubIntent}
          />
        </div>
      );
    } 
    topInputPanel = (
      <div>
        <div className="row">
          <div className="col-md-6">
            <input
              name="commName"
              type="text"
              value={this.state.commName}
              onChange={this.onChange}
              size="45"
              maxLength="20"
              className="input_text"
              placeholder="A unique reference name for yourself"
            />
            <small className="input_text">
              <p>A reference name (5-to-20 Chars).</p>
            </small>
          </div>
          <div className="col-md-6">
            <input
              name="commCaption"
              type="text"
              value={this.state.commCaption}
              onChange={this.onChange}
              size="50"
              maxLength="50"
              className="input_text"
              placeholder="A enticing caption that others will see"
            />
            <small className="input_text">
              <p>A caption for others (15-to-50 chars).</p>
            </small>
          </div>
        </div>
        <div className="row">
          <div className="col main text-center">
            <textarea
              name="commDescription"
              maxLength="500"
              placeholder="Write short description about your community or catalog."
              rows="4"
              wrap="hard"
              spellCheck="true"
              className="input_textarea"
              onChange={this.onChange}
              value={this.state.commDecription}
              required
            />
            <small>
              <p>** Describe your community - (min:50 max:1000 chars)</p>
            </small>
          </div>
        </div>
        <div className="row">
          <div className="col text-center radio-fonts">
            <strong>Joining Process: &nbsp;&nbsp;</strong>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  value="Private"
                  checked={this.state.joinProcess === "Private"}
                  onChange={this.handleJoinProcess}
                />{" "}
                Private (on invite)
              </label>
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  value="Public"
                  checked={this.state.joinProcess === "Public"}
                  onChange={this.handleJoinProcess}
                />{" "}
                Public
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Select
              value={this.state.intent}
              options={optionsIntent}
              className="intent-select"
              classNamePrefix="select"
              onChange={this.handleIntent}
            />
          </div>
          <div className="col-md-6">{subIntentPanel}</div>
        </div>
      </div>
    );

    let showPanel = <div>{topInputPanel}</div>;
    return (
      <div>
        <div className="text-center">
          <h6>New Community</h6>
        </div>
        <div className="fixedsize_create_comm text-center">{showPanel}</div>
        <ModalContainer />
      </div>
    );
  }
}

NewCreation.propTypes = {
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
)(withRouter(NewCreation));

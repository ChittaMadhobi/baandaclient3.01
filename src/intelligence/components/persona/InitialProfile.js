import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import ReactDOM from 'react-dom';
import axios from "axios";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

// import { postUserProfile } from '../../../actions/authActions';
import { postUserProfile } from "../../../actions/authActions";

import ModalContainer from "../../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../../actions/modalActions";
import "../../../modal/css/localModal.css";
import "../../../modal/css/template.css";

import "./InitialProfile.css";

class InitialProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      preferredName: this.props.auth.user.name,
      formalName: "",
      selfDecription: "",
      geoLocation: "Hometown",
      preferredPronoun: "",
      editPanelFlag: true,
      reviewPanelFlag: false,
      buttonState: "review",
      message:
        "Fill your intro-profile. You can change it via navbar-> your account. ",
      valid: false,
      locationCurr: {},
      phone: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handlePronounChange = this.handlePronounChange.bind(this);
  }
  async componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push('/login');
    }
    let retdata;
    try {
      let url = "https://ipapi.co/json/";
      retdata = await axios.get(url);
      if (!retdata.data) {
        throw new Error(
          "Geocentric return data not availabe for api = https://ipapi.co/json/"
        );
      } else {
        this.setState({
          locationCurr: retdata.data
        });
      }
      // console.log("retdata:", retdata.data);
    } catch (err) {
      console.log("Get geodata error:", err);
    }
    // console.log("retdata: ", retdata);
  }

  // componentWillUnmount() {
  //   this.props.history.goForward();
  // }

  onChange(e) {
    // console.log('onChange: ', e.target.name, ' value:', e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  }

  handleLocationChange(e) {
    this.setState({
      geoLocation: e.target.value
    });
  }

  handlePronounChange(e) {
    this.setState({
      preferredPronoun: e.target.value
    });
  }

  onReview = async () => {
    let msg = this.validate();
    // console.log('msg:', msg, ' this.state 1:', this.state);
    if (!msg.status) {
      await this.setState({
        editPanelFlag: true,
        reviewPanelFlag: false,
        buttonState: "review",
        message: msg.text
      });
    } else {
      await this.setState({
        editPanelFlag: false,
        reviewPanelFlag: true,
        buttonState: "save",
        message: msg.text
      });
    }
  };

  onSubmit(e) {
    e.preventDefault();
    let data = {
      user: this.props.auth.user,
      profile: {
        preferredName: this.state.preferredName,
        formalName: this.state.formalName,
        selfDecription: this.state.selfDecription,
        geoLocation: this.state.geoLocation,
        preferredPronoun: this.state.preferredPronoun,
        locationCurr: this.state.locationCurr,
        cell: this.state.phone
      }
    }
    // console.log('IP data: ', data);
    this.props.postUserProfile(data);
    this.props.history.push('/lobby');
  }

  onEdit = async () => {
    await this.setState({
      editPanelFlag: true,
      reviewPanelFlag: false,
      buttonState: "review",
      message: "Please edit, review and save if satisfied."
    });
  };

  validate = () => {
    let errMsg = "";
    let state = true;
    if (this.state.preferredName.trim().length < 5) {
      errMsg = errMsg + "Must have a name 5 to 40 chars. ";
      state = false;
    }

    if (this.state.selfDecription.trim().length < 10) {
      errMsg =
        errMsg +
        "Self Description should me at least 10 chars (you have used " +
        this.state.selfDecription.trim().length +
        "). ";
      state = false;
    }

    if (this.state.preferredPronoun === "") {
      errMsg = errMsg + "Specify your gender identity. ";
      state = false;
    }

    let msg = { status: state, text: errMsg };
    return msg;
  };

  render() {
    // console.log("this.props:", this.props.auth.user);
    // let preferredNameMsg = "Name others will see. Max length 40.";

    let submitButtons;
    if (this.state.buttonState === "review") {
      submitButtons = (
        <div>
          <button
            className="btn-submit_initprofile"
            type="button"
            onClick={this.onReview}
          >
            <b>Review</b>
          </button>
        </div>
      );
    } else {
      submitButtons = (
        <div>
          <button
            className="btn-save-edit"
            type="button"
            onClick={this.onSubmit}
          >
            <b>Save</b>
          </button>{" "}
          &nbsp;
          <button className="btn-save-edit" type="button" onClick={this.onEdit}>
            <b>Edit</b>
          </button>
        </div>
      );
    }

    // let geolocationpanel;
    // if (this.state.geoLocation === 'currentLocation') {
    let geolocationpanel = (
      <div>
        <div className="row">
          <div className="col review-text">
            <font color="#1c799e">
              <p align="justify">
                Following is your current geo-location. You
                can change this via MyAccount edit profile at anytime. Your community's geo-center could be different.{" "}
              </p>
            </font>
          </div>
        </div>
        <div className="row">
          <div className="col review-text">
            <p align="justify">
              <b>City:</b>&nbsp;{this.state.locationCurr.city}
            </p>
            <p align="justify">
              <b>Postal Code (ZIP):</b>&nbsp;{this.state.locationCurr.postal}
            </p>
            <p align="justify">
              <b>State:</b>&nbsp;{this.state.locationCurr.region}
            </p>
            <p align="justify">
              <b>Country:</b>&nbsp;{this.state.locationCurr.country_name}
            </p>
            <p align="justify">
              <b>Language:</b>&nbsp;English
            </p>
            <p align="justify">
              <b>Currency:</b>&nbsp;{this.state.locationCurr.currency}
            </p>
            <p align="justify">
              <b>Timezone:</b>&nbsp;{this.state.locationCurr.timezone}
            </p>
            <p align="justify">
              <b>Offset from GMT (now):</b>&nbsp;
              {this.state.locationCurr.utc_offset}&nbsp;hours
            </p>
            <p align="justify">
              <b>Latitude:</b>&nbsp;{this.state.locationCurr.latitude}&nbsp;
            </p>
            <p align="justify">
              <b>Longitude:</b>&nbsp;{this.state.locationCurr.longitude}&nbsp;
            </p>

            <p align="justify">
              <b>Carrier Org:</b>&nbsp;{this.state.locationCurr.org}
            </p>
          </div>
        </div>
      </div>
    );
    // }

    let geocentricNote;
    if (this.state.geoLocation === "Hometown") {
      console.log("In hometown");
      geocentricNote = (
        <div className="geo-position">
          <font color="#1d7010">
            <p align="justify">
              <b>Geocentric Note:</b> You have indicated you are now at your
              hometown. The information will be used to provide geocentric
              intelligence.
            </p>
          </font>
        </div>
      );
    } else {
      geocentricNote = (
        <div className="geo-position">
          <font color="#104270">
            <p align="justify">
              <b>Geocentric Note:</b> You have indicated you are now NOT at your
              hometown. You can fix it by going to MyAccount and edit profile
              when you are in your home town. This is for providing geocentric
              intelligence.
            </p>
          </font>
        </div>
      );
    }

    let showPanel;
    if (this.state.editPanelFlag) {
      showPanel = (
        <div>
          <div className="row text-center">
            <div className="col header_text_prof">Author Your Profile</div>
            {/* <div className="col-6">&nbsp;</div> */}
          </div>
          <br />
          <div className="row">
            <div className="col-md-6 text-center col-input-position-l">
              <input
                name="preferredName"
                type="text"
                value={this.state.preferredName}
                onChange={this.onChange}
                size="45"
                maxLength="40"
              />
              <small>
                <p>Name others will see; 5 to 40 Chars long.</p>
              </small>
            </div>
            <div className="col-md-6 text-center col-input-position-r">
              <input
                name="formalName"
                type="text"
                value={this.state.formalName}
                onChange={this.onChange}
                size="45"
              />
              <small>
                <p>Your formal/official name (optional)</p>
              </small>
            </div>
          </div>
          <div className="row">
            <div className="col main text-center">
              <textarea
                name="selfDecription"
                maxLength="500"
                placeholder="Write short something about how you feel about your life NOW. No one will see it except me (Baanda)."
                rows="4"
                wrap="hard"
                spellCheck="true"
                onChange={this.onChange}
                value={this.state.selfDecription}
                required
              />
              <small>
                <p>** Describe your "self" - (min:50 max:500 chars)</p>
              </small>
            </div>
          </div>
          <div className="row geo-position">
            <div className="col-md-6 text-center">
              <strong>Current location: &nbsp;</strong>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="Hometown"
                    checked={this.state.geoLocation === "Hometown"}
                    onChange={this.handleLocationChange}
                  />{" "}
                  Hometown
                </label>
              </div>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="Elsewhere"
                    checked={this.state.geoLocation === "Elsewhere"}
                    onChange={this.handleLocationChange}
                  />{" "}
                  Elsewhere
                </label>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <strong>Pronoun Preferred:&nbsp;&nbsp;</strong>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="She"
                    checked={this.state.preferredPronoun === "She"}
                    onChange={this.handlePronounChange}
                  />{" "}
                  She
                </label>
              </div>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="He"
                    checked={this.state.preferredPronoun === "He"}
                    onChange={this.handlePronounChange}
                  />{" "}
                  He
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <PhoneInput
                placeholder="Enter Cell number"
                value={this.state.phone}
                onChange={phone => this.setState({ phone })}
                country="US"
                className="phoneFlag"
              />
            </div>
            <div className="col-md-6">
              <small>
                <p align="justify message_text">
                  For notification only; can block selectively & contextually.{" "}
                </p>
              </small>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-8 message_text">
              <p>{this.state.message}</p>
            </div>
            <div className="col-4">{submitButtons}</div>
          </div>
        </div>
      );
    }

    if (this.state.reviewPanelFlag) {
      showPanel = (
        <div>
          <div className="row text-center">
            <div className="col header_text_prof">Review Your Profile</div>
          </div>
          <div className="row">
            <div className="col review-text">
              <b>Preferred:</b>&nbsp; {this.state.preferredName}
            </div>
          </div>
          <div className="row">
            <div className="col review-text">
              <b>Formal:</b>&nbsp;{this.state.formalName}
            </div>
          </div>
          <div className="row">
            <div className="col review-text">
              <p align="justify">
                <b>Self Description:</b>&nbsp; {this.state.selfDecription}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col review-text">
              <p align="justify">
                <b>Gender Identity:</b>&nbsp; {this.state.preferredPronoun}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col review-text">
              <p align="justify">
                <b>Cell:</b>&nbsp; {this.state.phone}
              </p>
            </div>
          </div>
          <div>{geolocationpanel}</div>
          <div>{geocentricNote}</div>
          <hr />
          <div className="row">
            <div className="col-8 message_text">
              <p>{this.state.message}</p>
            </div>
            <div className="col-4">{submitButtons}</div>
          </div>
          <div className="spacing_below" />
        </div>
      );
    }

    return (
      <div>
        <div className="fixedsize_initProfile">
          {/* <h3>This is InitialProfile ZZZ</h3> */}
          {showPanel}
        </div>
        <ModalContainer />
      </div>
    );
  }
}

InitialProfile.propTypes = {
  postUserProfile: PropTypes.func.isRequired,
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
  postUserProfile: val => {
    dispatch(postUserProfile(val));
  }
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
) (InitialProfile));

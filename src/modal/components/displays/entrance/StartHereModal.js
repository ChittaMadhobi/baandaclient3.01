import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { hideModal } from "../../../../actions/modalActions";
import "../../../css/localModal.css";
import "./StartHereModal.css";

class StartHereModal extends Component {
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
    console.log("props StartHereModal:" + JSON.stringify(this.props));
    //const { title, message, todotext } = this.props;
    // const { user } = this.props.auth;
    // console.log("user:" + JSON.stringify(user));
    // const { title, message } = this.props;

    // console.log("title :" + title + " | message:", message);
    return (
      <div className="container">
        <div className="modal-content-z">
          <div className="row text-center justify-content-center">
            <div className="modal-header-text">
              <h5>Baanda Home Overview</h5>
            </div>
          </div>

          <div className="modal-body">
            <div className="fixedsize-start-here">
              <div className="text-center">
                <font color="white" size="3">
                  <b>Simple steps 1, 2, 3, & 4 (go) </b>
                </font>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="start-here-msg notes-text">
                    {/* <font color="#ededd1"> */}
                    <p align="justify">
                      <b>Start&nbsp;:</b> I will ask some basic questions so I
                      can assist the special and unique you (your persona).
                      Faster you respond better it is. Don't think, use your
                      feelings. This is the initiation and will not be asked
                      again after you complete.
                    </p>
                    <hr />
                    <p align="justify">
                      <b>Step 1: </b> Create your unique community to chase your
                      dreams with people like you.
                    </p>
                    <p align="justify">
                      <b>Step 2: </b> Search, matche and join communities where
                      you want to be.
                    </p>
                    <p align="justify">
                      <b>Step 3: </b> Engage, work, play, interact, trust, share
                      reputations ... and more
                    </p>
                    {/* </font> */}
                   
                  </div>
                  <hr className="format" />
                  <div className="start-here-msg notes-text">
                    <font color="#abd9ed">
                      <p align="justify">
                        Notes: The core idea and vision of Baanda (your friend)
                        is to let you thrive in life with others who are
                        compatible with your persona, spirit, position in life
                        ... for a happier life of togetherness. It is all about
                        soulful collaboration with trustful relations and not
                        having to face life alone. Allow me to be your friend
                        and let's make this a happier planet to live in.
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

StartHereModal.propTypes = {
  hideModal: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { hideModal }
)(StartHereModal);

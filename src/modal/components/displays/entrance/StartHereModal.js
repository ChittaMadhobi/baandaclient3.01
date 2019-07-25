import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { hideModal } from "../../../../actions/modalActions";
import '../../../css/localModal.css';
import "./css/entrance.css";

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
    console.log("closeModal.func : " + this.state.todotext);
    const modTask = {
      todotext: this.state.todotext
    };

    this.props.hideModal(modTask);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    console.log("props :" + JSON.stringify(this.props));
    //const { title, message, todotext } = this.props;
    const { user } = this.props.auth;
    console.log("user:" + JSON.stringify(user));
    const { title, message } = this.props;

    console.log("title :" + title + " | message:", message);
    return (
      <div className="container">
        <div className="modal-content-z">
          <div className="row text-center justify-content-center">
            <div className="modal-header">
              <h5>
                Hello <font color="black">{this.props.auth.user.name}</font>
              </h5>
            </div>
          </div>

          <div className="modal-body">
            <div className="fixedsize-start-here">
              <div className="row">
                <div className="col-12">
                  <div className="start-here-msg">
                    <font color="#f2d579" size="2">
                      <p align="justify">
                        <b>Context Setup</b>: It will take a long time and
                        life-exchanges to experience the system. To provide a
                        holistic experience, you would be experiencing this via
                        a fictional character.
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

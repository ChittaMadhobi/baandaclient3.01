import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { hideModal } from "../../../../actions/modalActions";
import "../../../css/localModal.css";
import "./css/entrance.css";

import SiteMapPng from "./img/Site-map.png";

class SiteMap extends Component {
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
    // console.log("props :" + JSON.stringify(this.props));
    //const { title, message, todotext } = this.props;
    const { user } = this.props.auth;
    // console.log("user:" + JSON.stringify(user));
    // const { title, message } = this.props;

    // console.log("title :" + title + " | message:" + message);
    return (
      <div className="container">
        <div className="modal-content-z">
          <div className="row text-center justify-content-center">
            <div className="modal-header">
              <h5>
                Welcome{" "}
                {/* <font color="blue">{this.props.auth.user.name} ...</font> */}
                <font color="blue">{user.name} ...</font>
                &nbsp;Service Offerings of the Baanda Bazar
              </h5>
            </div>
          </div>

          <div className="modal-body">
            <div>
              <div className="row">
                <div className="col">
                  <div className="starthere-padding">
                    <div className="siteplan-fixedsize">
                      <div className="pictures">
                        <img
                          src={SiteMapPng}
                          width="100%"
                          height="100%"
                          alt="..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
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
              <i class="fas fa-street-view"></i>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

SiteMap.propTypes = {
  hideModal: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { hideModal }
)(SiteMap);

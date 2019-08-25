import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import axios from "axios";
// import _ from "lodash";
import "./Pos.css";

class Pos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ""
    };
  }

  async componentWillUnmount() {
    // console.log("I am in component will mount");
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
    this.props.history.goForward();
  }

  componentDidMount = async () => {
    // call to get the joiningProcess from communities using communityId
    // call getPosInitData()
    await this.getPosInitData();
  };

  getPosInitData = () => {
    console.log('I am into getPosInitData');
  }

  render() {
    console.log("Pos props:", this.props);
    return <div>Into the POS/Pos</div>;
  }
}

Pos.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(withRouter(Pos));

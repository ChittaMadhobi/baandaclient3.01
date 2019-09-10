import React, { Component } from "react";

import './NotMarket.css';

class NotMarket extends Component {

  goToDashboard = async () => {
    this.props.dashReturnMethod();
  };

  render() {
    // console.log('this.props:', this.props);

    let dispPanel = (
        <div className="text-center">
            <h5>Intent is Not Market</h5>
            <br /><br />
            <div className="row">
                <div className="col-1">&nbsp;</div>
                <div className="col-10">
                    <p align="justify">At this point, we are handling only 'Market' intent.</p>
                    <p align="justify">You defined this community's intent as <b>{this.props.intent}</b> and focus as <b>{this.props.focus}</b>.</p>
                    <p align='justify'>All non marketing intents will be implemented gradually. These are scheduled to be in by Q1 2020.</p>
                </div>
                <div className="col-1">&nbsp;</div>
            </div>
            <button
              className="btn-back-non-market"
              type="button"
              onClick={this.goToDashboard}
            >
               Dashboard &nbsp;
              <i className="fas fa-step-backward" />
            </button>
        </div>
    )
    return <div>{dispPanel}</div>;
  }
}

export default NotMarket;

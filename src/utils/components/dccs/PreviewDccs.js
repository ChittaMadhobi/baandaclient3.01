import React, { Component } from 'react';

import APersonality from './charts/APersonality';
import BCulture from './charts/BCulture';
import CCoop from './charts/CCooperation';
import DDriver from './charts/DDrivers';
import EMgmtStyles from './charts/EMgmtStyles';
import FWorkStyles from './charts/FWorkStyles';
import GDeliveryHandling from './charts/GDeliveryHandling';
import HPeerSentiment from './charts/HPeerSentiment';

import SummaryWorkDCCS from './charts/SummaryWorkDCCS';

import './dccs.css';

class PreviewDCCS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartA: true,
      chartB: false,
      chartC: false,
      chartD: false,
      chartE: false,
      chartF: false,
      chartG: false,
      chartH: false,
      chartI: false
    };

    //this.startListening = this.startListening.bind(this);
    this.showChartType = this.showChartType.bind(this);
  }

  // startListening(event) {
  //   const target = event.target;
  //   const name = target.name;
  //   console.log('name :' + name);
  //   for (let namex in this.state) {
  //     if (namex === name) {
  //       console.log('yes:' + namex);
  //       this.setState({
  //         [namex]: true
  //       });
  //     } else {
  //       console.log('no:' + namex);
  //       this.setState({
  //         [namex]: false
  //       });
  //     }
  //   }
  // }

  showChartType(chartName) {
    for (let name in this.state) {
      if (name === chartName) {
        this.setState({
          [name]: true
        });
      } else {
        this.setState({
          [name]: false
        });
      }
    }
  }

  render() {
    let chartout;
    //console.log('this.state:' + JSON.stringify(this.state));

    if (this.state.chartA) {
      chartout = (
        <div>
          <APersonality />
          <div>
            <font color="blue">
              Your personality average from peers and social-circle (now)
            </font>
          </div>
        </div>
      );
    } else if (this.state.chartB) {
      chartout = (
        <div>
          <BCulture />
          <div>
            <font color="blue">
              Impact of your Cultural Root on your current life (now)
            </font>
          </div>
        </div>
      );
    } else if (this.state.chartC) {
      chartout = (
        <div>
          <CCoop />
          <div>
            <font color="blue">
              Cooperation traits in % strength per you & your peers(now)
            </font>
          </div>
        </div>
      );
    } else if (this.state.chartD) {
      chartout = (
        <div>
          <DDriver />
          <div>
            <font color="blue">
              Drivers: Hands-on-skill, theoretical knowledge, inteligence,
              imagination
            </font>
          </div>
        </div>
      );
    } else if (this.state.chartE) {
      chartout = (
        <div>
          <EMgmtStyles />
          <div>
            <font color="blue">
              Mgmt. Style %: Analytical/logic, Driver/get-done,
              Amiable/friendly, Express/communicate.
            </font>
          </div>
        </div>
      );
    } else if (this.state.chartF) {
      chartout = (
        <div>
          <FWorkStyles />
          <div>
            <font color="blue">
              Mgmt. Style %: Architect/Envision, Proj.Mgr./get-done,
              Hands-on/work, Socializer.
            </font>
          </div>
        </div>
      );
    } else if (this.state.chartG) {
      chartout = (
        <div>
          <GDeliveryHandling />
          <div>
            <font color="blue">
              Delivery Feedback Measurement (time, quality, finance, overall).
            </font>
          </div>
        </div>
      );
    } else if (this.state.chartH) {
      chartout = (
        <div>
          <HPeerSentiment />
          <div>
            <font color="blue">
              Work-Peer Sentiments (Mood, Energy, Humility, Ethicalness,
              Integrity)
            </font>
          </div>
        </div>
      );
    } else if (this.state.chartI) {
      chartout = (
        <div>
          <SummaryWorkDCCS />
        </div>
      );
    } else {
      chartout = (
        <div>
          <h3>Under Development</h3>
        </div>
      );
    }
    return (
      <div className="dccs-graph-fixedsize">
        <div className="row">
          <div className="col-2">
            <div className="dccs-review-margin float-right">
              <b>
                <font color="#514e93">Click :</font>{' '}
              </b>
            </div>
          </div>
          <div className="col-1">
            <button
              name="chartA"
              className="btn control-btn-graphs"
              //onClick={this.startListening}
              onClick={() => {
                this.showChartType('chartA');
              }}
            >
              <b>
                <font color="#514e93">A</font>
              </b>
            </button>
          </div>
          <div className="col-1">
            <button
              name="chartB"
              className="btn control-btn-graphs"
              //onClick={this.startListening}
              onClick={() => {
                this.showChartType('chartB');
              }}
            >
              <b>
                <font color="#514e93">B</font>
              </b>
            </button>
          </div>
          <div className="col-1">
            <button
              name="chartC"
              className="btn control-btn-graphs"
              //onClick={this.startListening}
              onClick={() => {
                this.showChartType('chartC');
              }}
            >
              <b>
                <font color="#514e93">C</font>
              </b>
            </button>
          </div>
          <div className="col-1">
            <button
              name="chartD"
              className="btn control-btn-graphs"
              //onClick={this.startListening}
              onClick={() => {
                this.showChartType('chartD');
              }}
            >
              <b>
                <font color="#514e93">D</font>
              </b>
            </button>
          </div>
          <div className="col-1">
            <button
              name="chartE"
              className="btn control-btn-graphs"
              //onClick={this.startListening}
              onClick={() => {
                this.showChartType('chartE');
              }}
            >
              <b>
                <font color="#514e93">E</font>
              </b>
            </button>
          </div>
          <div className="col-1">
            <button
              name="chartF"
              className="btn control-btn-graphs"
              //onClick={this.startListening}
              onClick={() => {
                this.showChartType('chartF');
              }}
            >
              <b>
                <font color="#514e93">F</font>
              </b>
            </button>
          </div>
          <div className="col-1">
            <button
              name="chartG"
              className="btn control-btn-graphs"
              //onClick={this.startListening}
              onClick={() => {
                this.showChartType('chartG');
              }}
            >
              <b>
                <font color="#514e93">G</font>
              </b>
            </button>
          </div>
          <div className="col-1">
            <button
              name="chartH"
              className="btn control-btn-graphs"
              //onClick={this.startListening}
              onClick={() => {
                this.showChartType('chartH');
              }}
            >
              <b>
                <font color="#514e93">H</font>
              </b>
            </button>
          </div>
          <div className="col-1">
            <button
              name="chartI"
              className="btn control-btn-graphs"
              //onClick={this.startListening}
              onClick={() => {
                this.showChartType('chartI');
              }}
            >
              <b>
                <font color="#514e93">I</font>
              </b>
            </button>
          </div>
          <div className="col-1">&nbsp;</div>
        </div>
        <div className="row">
          <div className="col">
            <div className="chart-sizeY">{chartout}</div>
            {/* {chartout} */}
          </div>
        </div>
      </div>
    );
  }
}

export default PreviewDCCS;

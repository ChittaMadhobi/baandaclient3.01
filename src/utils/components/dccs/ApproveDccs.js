import React, { Component } from 'react';

class ApproveDccs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      personality: true,
      culture: false,
      coopVscompete: false,
      skillAcclaim: true,
      mgmtStyle: true,
      workStyle: true,
      delivery: true,
      sentiment: false,
      workdccssummary: true
    };

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  handleCheckboxChange(event) {
    const target = event.target;
    const checked = target.checked;
    const name = target.name;
    this.setState({
      [name]: checked
    });
    //console.log('personality:' + JSON.stringify(this.state));
  }

  handleSendClick = () => {
    console.log('this.state' + JSON.stringify(this.state));
  };

  render() {
    return (
      <div className="dccsfixedsizeNew">
        <div className="text-center">
          {' '}
          <h4>Approve DCCS Dimensions per Request</h4>
        </div>
        {/* <div className="space-at-top" /> */}
        <div className="row">
          <div className="col-md-12 col-sm-6">
            <div className="float-left">
              <strong>
                <h6>
                  <font color="white">PERSONAL</font>
                </h6>
              </strong>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-6">
            <div className="float-left">
              &nbsp;&nbsp;
              <label>
                <input
                  type="checkbox"
                  name="personality"
                  value={this.state.personality}
                  onChange={this.handleCheckboxChange}
                  defaultChecked={this.state.personality}
                />
                &nbsp;
                <b>A.</b>
                &nbsp;&nbsp;Personality (Openness, Conscientious,
                Extro/Introvert, Agreeable, Neroticism)
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-6">
            <div className="float-left">
              &nbsp;&nbsp;
              <label>
                <input
                  type="checkbox"
                  name="culture"
                  value={this.state.culture}
                  onChange={this.handleCheckboxChange}
                  defaultChecked={this.state.culture}
                />
                &nbsp;
                <b>B.</b>
                &nbsp;&nbsp;Culture Culture (Power, Uncertainity, Sexisim,
                Individual, Strategy)
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-6">
            <div className="float-left">
              <strong>
                <h6>
                  <font color="white">DRIVERS (Work-Life)</font>
                </h6>
              </strong>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-6">
            <div className="float-left">
              &nbsp;&nbsp;
              <label>
                <input
                  type="checkbox"
                  name="coopVscompete"
                  value={this.state.coopVscompete}
                  onChange={this.handleCheckboxChange}
                  defaultChecked={this.state.coopVscompete}
                />
                &nbsp;
                <b>C.</b>
                &nbsp;&nbsp;Cooperation Vs. Competion (Social Psychological
                Reflection)
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-6">
            <div className="float-left">
              &nbsp;&nbsp;
              <label>
                <input
                  type="checkbox"
                  name="skillAcclaim"
                  value={this.state.skillAcclaim}
                  onChange={this.handleCheckboxChange}
                  defaultChecked={this.state.skillAcclaim}
                />
                &nbsp;
                <b>D.</b>
                &nbsp;&nbsp;Hands-on-skill, Knowledge, Intelligence, Imagination
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-6">
            <div className="float-left">
              <strong>
                <h6>
                  <font color="white">STYLE PREFERENCES (Work)</font>
                </h6>
              </strong>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-6">
            <div className="float-left">
              &nbsp;&nbsp;
              <label>
                <input
                  type="checkbox"
                  name="mgmtStyle"
                  value={this.state.mgmtStyle}
                  onChange={this.handleCheckboxChange}
                  defaultChecked={this.state.mgmtStyle}
                />
                &nbsp;
                <b>E.</b>
                &nbsp;&nbsp; Mgmt. Style Distribution (Analytica, Driver,
                Amiable, Expressive)
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-6">
            <div className="float-left">
              &nbsp;&nbsp;
              <label>
                <input
                  type="checkbox"
                  name="workStyle"
                  value={this.state.workStyle}
                  onChange={this.handleCheckboxChange}
                  defaultChecked={this.state.workStyle}
                />
                &nbsp;
                <b>F.</b>
                &nbsp;&nbsp;Work Style Distribution (Architect, Proj. Mgr.,
                Hands-on, Socializer)
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-6">
            <div className="float-left">
              <strong>
                <h6>
                  <font color="white">DEPENDABILITY (Work)</font>
                </h6>
              </strong>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-6">
            <div className="float-left">
              &nbsp;&nbsp;
              <label>
                <input
                  type="checkbox"
                  name="delivery"
                  value={this.state.delivery}
                  onChange={this.handleCheckboxChange}
                  defaultChecked={this.state.delivery}
                />
                &nbsp;
                <b>G.</b>
                &nbsp;&nbsp;Delivery Project-Work handling (In-time,
                Per-quality, Fiscal-responsibility)
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-6">
            <div className="float-left">
              <strong>
                <h6>
                  <font color="white">PEER SENTIMENTS (Work)</font>
                </h6>
              </strong>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-6">
            <div className="float-left">
              &nbsp;&nbsp;
              <label>
                <input
                  type="checkbox"
                  name="sentiment"
                  value={this.state.sentiment}
                  onChange={this.handleCheckboxChange}
                  defaultChecked={this.state.sentiment}
                />
                &nbsp;
                <b>H.</b>
                &nbsp;&nbsp;Peer-sentiments (general>> mood, energy, humility,
                ethics, integrity)
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-6">
            <div className="float-left">
              &nbsp;&nbsp;
              <label>
                <input
                  type="checkbox"
                  name="workdccssummary"
                  value={this.state.workdccssummary}
                  onChange={this.handleCheckboxChange}
                  defaultChecked={this.state.workdccssummary}
                />
                &nbsp;
                <b>H.</b>
                &nbsp;&nbsp;Summary (Communication, Domain KB, Team player,
                meet-deadlines, solvers, in-time)
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ApproveDccs;

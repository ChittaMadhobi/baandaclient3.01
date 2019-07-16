import React, { Component } from 'react';
import './dccs.css';
import RequestDCCS from './RequestDccs';
import ApproveDCCS from './ApproveDccs';
import PreviewDCCS from './PreviewDccs';
import DefaultMsg from './charts/DefaultMsg';

class DccsSendBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      requestdccs: false,
      approvedccs: false,
      reviewdccs: false,
      default: true
    };
    this.handleSendClick = this.handleSendClick.bind(this);
    this.prepDccsRequest = this.prepDccsRequest.bind(this);
    this.approveDccsRequest = this.approveDccsRequest.bind(this);
    this.reviewDccsRequest = this.reviewDccsRequest.bind(this);
  }

  handleSendClick() {
    alert(
      'This is an UX or usability experience. At this point in production (by your click on Send button), your message would apear in ' +
        "the receipient's message box. "
    );
    this.setState({
      requestdccs: false,
      approvedccs: false,
      reviewdccs: false,
      default: true
    });
  }

  prepDccsRequest() {
    this.setState({
      requestdccs: true,
      approvedccs: false,
      reviewdccs: false,
      default: false
    });
  }

  approveDccsRequest = () => {
    this.setState({
      requestdccs: false,
      approvedccs: true,
      reviewdccs: false,
      default: false
    });
  };

  reviewDccsRequest = () => {
    this.setState({
      requestdccs: false,
      approvedccs: false,
      reviewdccs: true,
      default: false
    });
  };

  render() {
    const ctrlPanel = (
      <div className="text-center ctrl-panel">
        <div className="space-at-top" />
        <h4>
          <div className="header-shadow">
            <b>
              <font color="#cbd8ed">DCCS Send Controls</font>
            </b>
          </div>
        </h4>
        <div className="space-below-heading" />

        <div className="text-center">
          <button
            className="btn control-btn-start"
            onClick={this.prepDccsRequest}
          >
            Prepare
            <div className="float-right">
              <i className="fab fa-creative-commons-sampling-plus" />
            </div>
          </button>{' '}
        </div>
        <div className="space-between-buttons" />
        <div className="text-center">
          <button
            className="btn control-btn-reset"
            onClick={this.approveDccsRequest}
          >
            Approve
            <div className="float-right">
              <i className="far fa-eye" />
            </div>
          </button>
        </div>
        <div className="space-between-buttons" />
        <div className="text-center">
          <button
            className="btn control-btn-preview"
            onClick={this.reviewDccsRequest}
          >
            Review
            <div className="float-right">
              <i className="far fa-eye" />
            </div>
          </button>
        </div>
        <div className="space-between-buttons" />
        <div className="text-center">
          <button
            className="btn control-btn-send"
            type="button"
            onClick={this.handleSendClick}
          >
            Send
            <div className="float-right">
              <i className="far fa-envelope" />
            </div>
          </button>
        </div>
        <div className="space-below-heading" />

        <div className="row">
          <div className="col-1">&nbsp;</div>
          <div className="col-10">
            <div className="text-center vedio-msg">
              <b>Prepare</b> your request; <b>Approve</b> a request;{' '}
              <b>Review</b> your metric.
            </div>
          </div>
          <div className="col-1">&nbsp;</div>
        </div>
      </div>
    );

    let dccsout;
    if (this.state.requestdccs) {
      dccsout = (
        <div>
          <RequestDCCS />
        </div>
      );
    } else if (this.state.approvedccs) {
      dccsout = (
        <div>
          <ApproveDCCS />
        </div>
      );
    } else if (this.state.reviewdccs) {
      dccsout = (
        <div>
          <PreviewDCCS />
        </div>
      );
    } else if (this.state.default) {
      dccsout = (
        <div>
          <DefaultMsg />
        </div>
      );
    } else {
      dccsout = <div>Moa here NOT sending dccs request - something wrong</div>;
    }
    return (
      <div className="container">
        <div className="speech-box-background">
          <div ref="app">
            <div className="text-center">
              <div className="row">
                <div className="col-md-4 col-sm-6">{ctrlPanel}</div>
                <div className="col-md-8 col-sm-6">{dccsout}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DccsSendBase;

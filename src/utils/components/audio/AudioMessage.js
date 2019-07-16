import React, { Component } from 'react';
import MediaCapturer from 'react-multimedia-capture';

import './audio.css';
import soundwavepic from './img/tenor.gif';

class AudioMessage extends Component {
  constructor() {
    super();
    this.state = {
      granted: false,
      rejectedReason: '',
      recording: false,
      paused: false,
      listenurl: '',
      listenblob: '',
      showsoundgif: false
    };

    this.handleGranted = this.handleGranted.bind(this);
    this.handleDenied = this.handleDenied.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleResume = this.handleResume.bind(this);
    this.downloadAudio = this.downloadAudio.bind(this);

    this.listenAudio = this.listenAudio.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
    this.handleAudioEnded = this.handleAudioEnded.bind(this);
  }

  handleSendClick() {
    alert(
      'This is an UX or usability experience. At this point in production (by your click on Send button), your message would apear in ' +
        "the receipient's message box. The quality of the audio-mesage will depend on your microphone, driers and the browser."
    );
  }

  handleGranted() {
    this.setState({ granted: true });
    //console.log('Permission Granted!');
  }
  handleDenied(err) {
    this.setState({ rejectedReason: err.name });
    //console.log('Permission Denied!', err);
  }
  handleStart(stream) {
    this.setState({
      recording: true,
      showsoundgif: true
    });

    //console.log('Recording Started.');
  }
  handleStop(blob) {
    this.setState({
      recording: false,
      showsoundgif: false
    });

    //console.log('Recording Stopped.');
    this.downloadAudio(blob);
  }
  handlePause() {
    this.setState({
      paused: true
    });
  }
  handleResume(stream) {
    this.setState({
      paused: false
    });
  }
  handleError(err) {
    console.log(err);
  }
  downloadAudio(blob) {
    let url = URL.createObjectURL(blob);
    this.setState({
      listenurl: url,
      listenblob: blob
    });

    // let a = document.createElement('a');
    // a.style.display = 'none';
    // a.href = url;
    // a.target = '_blank';
    // document.body.appendChild(a);

    // a.click();
  }

  listenAudio() {
    this.setState({
      showsoundgif: true
    });
    if (this.state.listenurl !== '') {
      var p = document.getElementById('yyy');
      p.src = this.state.listenurl;
    } else {
      console.log('Error: this.state.listenurl is blank');
    }
  }
  handleAudioEnded() {
    this.setState({
      showsoundgif: false
    });
  }

  render() {
    const granted = this.state.granted;
    const rejectedReason = this.state.rejectedReason;
    const recording = this.state.recording;
    //const paused = this.state.paused;
    let soundwave;

    if (this.state.showsoundgif) {
      soundwave = (
        <div className="sound-height">
          <img
            src={soundwavepic}
            width="100%"
            height="300"
            // class="img-thumbnail"
            className="img-fluid"
            alt="..."
          />
        </div>
      );
    } else {
      soundwave = null;
    }
    const render1 = ({ start, stop, pause, resume }) => (
      <div className="text-center ctrl-panel-y">
        <div className="space-at-top" />
        <h4>
          <div className="header-shadow">
            <b>
              <font color="#cbd8ed">Audio Controls</font>
            </b>
          </div>
        </h4>
        <div className="space-at-top" />
        <div className="float-center">
          <div>
            {/* <b>Granted:</b> {granted.toString()} */}
            <b>Granted:</b> &nbsp;&nbsp;
            {granted ? (
              <font color="lightgreen">
                <b>Yes</b>
              </font>
            ) : (
              <font color="#e59679">
                <b>No</b>
              </font>
            )}
          </div>
          <div>
            {/* <b>Rejected:</b> {rejectedReason} */}
            <b>Rejected:</b>
            &nbsp;&nbsp;
            {rejectedReason === '' ? (
              <font color="lightgreen">
                <b>No</b>
              </font>
            ) : (
              <font color="#e59679">
                <b>rejectedReason</b>
              </font>
            )}
          </div>
          <div>
            <b>Rcording:</b>
            &nbsp;&nbsp;
            {recording ? (
              <font color="lightgreen">
                <b>Yes</b>
              </font>
            ) : (
              <font color="#e59679">
                <b>No</b>
              </font>
            )}
          </div>
        </div>
        <div className="space-between-buttons" />
        <div className="text-center">
          {/* <p>Paused: {paused.toString()}</p> */}
          <button className="btn control-btn-start" onClick={start}>
            Start
            <div className="float-right">
              <i className="far fa-play-circle" />
            </div>
          </button>{' '}
        </div>
        <div className="space-between-buttons" />
        <div className="text-center">
          <button className="btn control-btn-done" onClick={stop}>
            Done
            <div className="float-right">
              <i className="far fa-stop-circle" />
            </div>
          </button>
        </div>
        <div className="space-between-buttons" />
        <div className="text-center">
          <button
            className="btn control-btn-preview "
            type="button"
            onClick={this.listenAudio}
          >
            Listen
            <div className="float-right">
              <i className="fas fa-headphones-alt" />
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
            Send &nbsp;&nbsp;
            <div className="float-right">
              <i className="far fa-envelope" />
            </div>
          </button>
        </div>
        <div className="space-between-buttons" />
        <div className="row">
          <div className="col-1">&nbsp;</div>
          <div className="col-10 ">
            <div className="text-center vedio-msg">
              Click <b>Start</b> then <b>Done</b>. &nbsp; Repeat till OK then{' '}
              <b>Send</b>.
            </div>
          </div>
          <div className="col-1">&nbsp;</div>
        </div>
      </div>
    );

    return (
      <div className="container the-box-background">
        <div ref="app">
          <div className="text-center">
            <div className="row">
              <div className="col-md-4 col-sm-6">
                <MediaCapturer
                  constraints={{ audio: true }}
                  mimeType="audio/webm"
                  timeSlice={10}
                  onGranted={this.handleGranted}
                  onDenied={this.handleDenied}
                  onStart={this.handleStart}
                  onStop={this.handleStop}
                  onPause={this.handlePause}
                  onResume={this.handleResume}
                  onError={this.handleError}
                  render={render1}
                />
              </div>
              <div className="col-md-8 col-sm-6">
                <div className="sound-height">{soundwave}</div>
              </div>
            </div>
            <audio
              className="fixed-height"
              onEnded={this.handleAudioEnded}
              id="yyy"
              autoPlay
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AudioMessage;

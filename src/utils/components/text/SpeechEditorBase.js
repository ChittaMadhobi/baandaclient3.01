import React, { Component } from 'react';
import SpeechRecognition from 'react-speech-recognition';
import NoteContainer from './NoteContainerW';

import './text.css';

const options = {
  autoStart: false
};

class SpeechEditorBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: false
    };
    this.speechEdit = this.speechEdit.bind(this);
    this.switchToSpeechMode = this.switchToSpeechMode.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
  }

  handleSendClick() {
    alert(
      'This is an UX or usability experience. At this point in production (by your click on Send button), your message would apear in ' +
        "the receipient's message box. "
    );
  }

  switchToSpeechMode = () => {
    this.setState({
      editorState: false
    });
  };

  speechEdit() {
    console.log('in speechEdit:');
    console.log('transcript:' + this.props.finalTranscript);
    this.setState({
      editorState: true
    });
  }

  render() {
    const {
      transcript,
      resetTranscript,
      startListening,
      stopListening,
      //finalTranscript,
      listening,
      browserSupportsSpeechRecognition
    } = this.props;

    const ctrlPanel = (
      <div className="text-center ctrl-panel">
        <div className="space-at-top" />
        <h4>
          <div className="header-shadow">
            <b>
              <font color="#cbd8ed">Editor Controls</font>
            </b>
          </div>
        </h4>
        <div className="space-between" />
        <div className="float-center">
          <div>
            <b>Browser support:</b> &nbsp;&nbsp;
            {browserSupportsSpeechRecognition ? (
              <font color="lightgreen">
                <b>Yes</b>
              </font>
            ) : (
              <font color="#e59679">
                <b>No </b>
              </font>
            )}
          </div>
          <div>
            <b>Listening:</b> &nbsp;&nbsp;
            {listening ? (
              <font color="lightgreen">
                <b>Yes</b>
              </font>
            ) : (
              <font color="#e59679">
                <b>No </b>
              </font>
            )}
          </div>
        </div>
        <div className="space-between-buttons" />
        <div className="text-center">
          <button className="btn control-btn-start" onClick={startListening}>
            Start
            <div className="float-right">
              <i className="far fa-play-circle" />
            </div>
          </button>{' '}
        </div>
        <div className="space-beteween" />
        <div className="text-center">
          <button className="btn control-btn-done" onClick={stopListening}>
            Done
            <div className="float-right">
              <i className="far fa-stop-circle" />
            </div>
          </button>
        </div>
        <div className="space-beteween" />
        <div className="text-center">
          <button className="btn control-btn-reset" onClick={resetTranscript}>
            Reset
            <div className="float-right">
              <i className="far fa-stop-circle" />
            </div>
          </button>
        </div>
        <div className="space-between" />
        <div className="text-center">
          <button
            className="btn control-btn-edit"
            type="button"
            onClick={this.speechEdit}
          >
            Edit
            <div className="float-right">
              <i className="fas fa-pen-fancy" />
            </div>
          </button>
        </div>
        <div className="space-between" />
        <div className="text-center">
          <button
            className="btn control-btn-speechToTextMode"
            type="button"
            onClick={this.switchToSpeechMode}
          >
            Speak
            <div className="float-right" onClick={this.handleSendClick}>
              <i className="fas fa-microphone-alt" />
            </div>
          </button>
        </div>
        <div className="space-between" />
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
        <div className="space-between" />

        <div className="row">
          <div className="col-1">&nbsp;</div>
          <div className="col-10">
            <div className="text-center vedio-msg">
              <b>Start</b> speak; <b>Done Edit Send. Speak</b> to switch back.
            </div>
          </div>
          <div className="col-1">&nbsp;</div>
        </div>
      </div>
    );

    let speechTextEditor;
    if (this.state.editorState) {
      speechTextEditor = (
        <div className="editor-box">
          <NoteContainer editorContextx={this.props.finalTranscript} />
        </div>
      );
    } else {
      speechTextEditor = <b>{transcript}</b>;
    }

    return (
      <div className="container">
        <div className="speech-box-background">
          <div ref="app">
            <div className="text-center">
              <div className="row">
                <div className="col-md-4 col-sm-6">{ctrlPanel}</div>
                <div className="col-md-8 col-sm-6">
                  <span>{speechTextEditor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SpeechRecognition(options)(SpeechEditorBase);

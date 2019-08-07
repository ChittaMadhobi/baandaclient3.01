import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "react-addons-update";

import ReactS3 from "react-s3";
// import axios from "axios";

import ModalContainer from "../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../actions/modalActions";
import "../../modal/css/localModal.css";
import "../../modal/css/template.css";

import Select from "react-select";
import { optionsIntent } from "./data/selectOptions";
import { optionsBizIntent } from "./data/bizOptions";
import { optionsColiveIntent } from "./data/coliveOptions";
import { optionsFunstuffIntent } from "./data/funstuffOptions";

import Review from './Review';

import "./NewCreation.css";
import cosmicDoorway from "./image/cosmicDoorway.jpg";

// const baandaServer = process.env.REACT_APP_BAANDA_SERVER;

const awsAccessKeyId = process.env.REACT_APP_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.REACT_APP_SECRET_ACCESS_KEY;
const awsRegion = process.env.REACT_APP_AWS_REGION;
const s3BucketName = process.env.REACT_APP_S3_BUCKET_NAME;

// import cosmicDoorway from "./image/Cloud-Vectors.jpg";

class NewCreation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      commName: "", // input text  5 to 20 chars
      commCaption: "", // input text 15 - to 50
      commDescription: "", // input textarea 50 to 1000 chars
      joinProcess: "Private", // Radio Button
      intent: "", // This is drop down
      subIntent: "",
      fileUploads: [
        {
          contentType: "", // audio, video, pdf, pic
          bucket: "",
          dirname: "",
          key: "",
          caption: "",
          s3Url: ""
        }
      ],
      picCaption: "",
      uploadFileType: "",
      uploadBtnClicked: false,
      uploadMsg: "",
      saveReviewMsg: "Save progressively. Upon Review you can Publish.",

      hightlight: false,
      currFilename: "",
      fileNameToDisplay: "",
      disabled: false,

      reviewFlag: false,
      reviewObject: {}
    };

    this.fileInputRef = React.createRef();
    this.openFileDialog = this.openFileDialog.bind(this);
    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleJoinProcess = this.handleJoinProcess.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  uploadToS3 = async e => {
    // console.log("upload ng: ", e.target.files[0]);
    let dirname = "bid" + this.props.auth.user.baandaId;
    let config = {
      bucketName: s3BucketName,
      dirName: dirname,
      region: awsRegion,
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey
    };
    console.log("Uplading file: ", this.state.currFilename);
    console.log("config: ", config);
    let index;
    // pic=0, vedio=1, & audio=2 -- only three kinds are allowed  now.
    if (this.state.uploadFileType === "pic") {
      index = 0;
    } else if (this.state.uploadFileType === "vedio") {
      index = 1;
    } else {
      index = 2;
    }
    console.log("index :", index);
    try {
      let data = await ReactS3.uploadFile(this.state.currFilename, config);
      let s3fileObject = {
        contentType: this.state.uploadFileType,
        bucket: data.bucket,
        dirname: dirname,
        key: data.key,
        caption: this.state.picCaption,
        s3Url: data.location
      };
      console.log("Data:", data, " s3fileObject:", s3fileObject);
      // this.setState(prevState => ({
      //   fileUploads: {
      //     ...prevState.fileUploads, [prevState.fileUploads[index]]: s3fileObject
      //   }
      // }))
      await this.setState({
        fileUploads: update(this.state.fileUploads, {
          0: { $set: s3fileObject }
        })
      });
    } catch (err) {
      console.log("uploadng Error:", err);
    }
  };

  openFileDialog() {
    this.fileInputRef.current.click();
  }

  async onFilesAdded(evt) {
    // let fullPath = evt.target.value;
    // let filename;
    // if (fullPath) {
    //   filename = fullPath.split(/(\\|\/)/g).pop()
    // }

    const files = evt.target.files;
    await this.setState({
      currFilename: files[0],
      fileNameToDisplay: "Ready to upload: " + files[0].name
    });

    console.log("filename:", this.state.fileNameToDisplay);
    // In case, in future we allow multifile upload
    // if (this.props.onFilesAdded) {
    //   const array = this.fileListToArray(files);
    //   this.props.onFilesAdded(array);
    // }
  }

  // for future use when we allow multiple files to be uploaded.
  // fileListToArray(list) {
  //   const array = [];
  //   for (var i = 0; i < list.length; i++) {
  //     array.push(list.item(i));
  //   }
  //   return array;
  // }

  onDragOver(evt) {
    evt.preventDefault();
    // if (this.state.disabled) return;
    console.log("In drop zone");
    this.setState({ hightlight: true });
  }

  onDragLeave() {
    this.setState({ hightlight: false });
  }

  async onDrop(event) {
    event.preventDefault();
    // console.log("this.props:", this.props);
    if (this.state.disabled) return; // investigate
    const files = event.dataTransfer.files;
    console.log("files: ", files);
    await this.setState({
      hightlight: false,
      currFilename: files[0],
      fileNameToDisplay: "Ready to upload: " + files[0].name
    });
    // For now, we need to do it for picture only. Later for other types
    // This should be part of the upload process
    // this.setState(prevState => ({
    //   fileUploads: prevState.fileUploads.map(
    //     obj => (obj.contentType === 'pic' ? Object.assign(obj, { name: 'filename', caption: 'new caption', s3url: 'new url'}) : obj)
    //   )
    // }));
  }

  async onChange(e) {
    // console.log('onChange: ', e.target.name, ' value:', e.target.value);
    await this.setState({ [e.target.name]: e.target.value });
  }

  async handleJoinProcess(e) {
    await this.setState({
      joinProcess: e.target.value
    });
  }

  handleIntent = async (selectedOption, { action }) => {
    await this.setState({
      intent: selectedOption
    });
  };
  handleSubIntent = async (selectedOption, { action }) => {
    await this.setState({
      subIntent: selectedOption
    });
  };

  setUploadType = async type => {
    console.log("upload type:", type);
    await this.setState({
      uploadFileType: type,
      uploadBtnClicked: true,
      uploadMsg: "Click, Tap, or Darg'n-Drop."
    });
  };

  reviewBeforeSave = async () => {
    
    let revobj = {
      commName: this.state.commName,
      commCaption: this.state.commCaption,
      commDescription: this.state.commDescription,
      joinProcess: this.state.joinProcess,
      intent: this.state.intent, // This is drop down
      subIntent: this.state.subIntent,
      fileUploads: this.state.fileUploads,
      picCaption: this.state.picCaption,
    }
    await this.setState({
      reviewFlag: true,
      saveReviewMsg: "To be available in your dashboard for details setup, please Publish first.",
      reviewObject: revobj
    });

  };

  editCreation = async () => {
    await this.setState({
      reviewFlag: false
    })
  }

  render() {
    console.log("this.state: ", this.state);
    // console.log('accesskey:' , awsAccessKeyId);

    let fileLoadBtn;
    fileLoadBtn = (
      <div className="file_load_btn_positions">
        <span>
          <b>Upload Files:</b>&nbsp;
          <button
            className="btn-upload-active"
            type="button"
            onClick={() => this.setUploadType("pic")}
            style={{ cursor: this.state.disabled ? "default" : "pointer" }}
          >
            <b>Picture</b>
          </button>
          &nbsp;&nbsp;
          <button
            className="btn-upload-inactive"
            type="button"
            onClick={() => this.setUploadType("vedio")}
            disabled
          >
            <b>Vedio</b>
          </button>
          &nbsp;&nbsp;
          <button
            className="btn-upload-inactive"
            type="button"
            onClick={() => this.setUploadType("audio")}
            disabled
          >
            <b>Audio</b>
          </button>
        </span>
      </div>
    );

    let saveReviewPanel;
    if (!this.state.reviewFlag) {   // Edit mode
      saveReviewPanel = (
        <div>
          <button
            className="btn-savereview"
            type="button"
            onClick={this.saveCreation}
            style={{ cursor: this.state.disabled ? "default" : "pointer" }}
          >
            <b>Save</b>
          </button>
          &nbsp;&nbsp;
          <button
            className="btn-savereview"
            type="button"
            onClick={this.reviewBeforeSave}
            style={{ cursor: this.state.disabled ? "default" : "pointer" }}
          >
            <b>Review</b>
          </button>
        </div>
      );
    } else {
      saveReviewPanel = (
        <div>
          <button
            className="btn-savereview"
            type="button"
            onClick={this.editCreation}
            style={{ cursor: this.state.disabled ? "default" : "pointer" }}
          >
            <b>Edit</b>
          </button>
          &nbsp;&nbsp;
          <button
            className="btn-savereview"
            type="button"
            // onClick={this.reviewBeforeSave}
            style={{ cursor: this.state.disabled ? "default" : "pointer" }}
          >
            <b>Publish</b>
          </button>
        </div>
      );
    }

    let uploadpanel;
    if (this.state.uploadBtnClicked) {
      uploadpanel = (
        <div>
          <div className="row">
            <div className="col-6">
              <div
                className={`dropzone ${
                  this.state.hightlight ? "Highlight" : ""
                }`}
                onDragOver={this.onDragOver}
                onDragLeave={this.onDragLeave}
                onDrop={this.onDrop}
                onClick={this.openFileDialog}
                style={{ cursor: this.state.disabled ? "default" : "pointer" }}
              >
                <p className="text-center top_of_card">File Dropzone</p>
                <img alt="upload" className="Icon" src={cosmicDoorway} />
                <input
                  ref={this.fileInputRef}
                  className="FileInput"
                  type="file"
                  multiple
                  onChange={this.onFilesAdded}
                />
              </div>
            </div>
            <div className="col-6 upload_message">
              &nbsp;
              <p>{this.state.uploadMsg}</p>
              <textarea
                name="picCaption"
                maxLength="50"
                placeholder="Caption of the picture."
                rows="2"
                wrap="hard"
                spellCheck="true"
                className="input_textarea_pic_caption"
                onChange={this.onChange}
                value={this.state.commDecription}
                required
              />
              <p className="pic_caption_msg">** Caption (10 to 50 chars)</p>
              <p className="pic_caption_msg">
                <b>{this.state.fileNameToDisplay}</b>
              </p>
              <span>
                <button
                  className="btn-load_to_cloud"
                  type="button"
                  onClick={this.uploadToS3}
                  style={{
                    cursor: this.state.disabled ? "default" : "pointer"
                  }}
                >
                  <b>Upload</b>
                </button>
              </span>
            </div>
          </div>
        </div>
      );
    }
    let topInputPanel;
    let subIntentPanel = null;
    if (this.state.intent.value === "Business") {
      subIntentPanel = (
        <div>
          <Select
            value={this.state.subIntent}
            options={optionsBizIntent}
            className="intent-select"
            classNamePrefix="select"
            onChange={this.handleSubIntent}
          />
        </div>
      );
    } else if (this.state.intent.value === "Co-live") {
      subIntentPanel = (
        <div>
          <Select
            value={this.state.subIntent}
            options={optionsColiveIntent}
            className="intent-select"
            classNamePrefix="select"
            onChange={this.handleSubIntent}
          />
        </div>
      );
    } else if (this.state.intent.value === "Fun-Stuff") {
      subIntentPanel = (
        <div>
          <Select
            value={this.state.subIntent}
            options={optionsFunstuffIntent}
            className="intent-select"
            classNamePrefix="select"
            onChange={this.handleSubIntent}
          />
        </div>
      );
    }
    topInputPanel = (
      <div>
        <div className="row">
          <div className="col-md-6 input_text_creation_caption">
            <input
              name="commName"
              type="text"
              value={this.state.commName}
              onChange={this.onChange}
              size="40"
              maxLength="20"
              className="input_text"
              placeholder="A unique reference name ..."
            />
            <small className="input_text">
              <p>A reference name (5-to-20 Chars).</p>
            </small>
          </div>
          <div className="col-md-6 input_text_creation_caption">
            <input
              name="commCaption"
              type="text"
              value={this.state.commCaption}
              onChange={this.onChange}
              size="40"
              maxLength="50"
              className="input_text"
              placeholder="A enticing caption for others ..."
            />
            <small className="input_text">
              <p>A caption for others (15-to-50 chars).</p>
            </small>
          </div>
        </div>
        <div className="row">
          <div className="col main text-center">
            <textarea
              name="commDescription"
              maxLength="500"
              placeholder="Write short description about your community or catalog."
              rows="4"
              wrap="hard"
              spellCheck="true"
              className="input_textarea"
              onChange={this.onChange}
              value={this.state.commDecription}
              required
            />
            <small>
              <p>** Describe your community - (min:50 max:1000 chars)</p>
            </small>
          </div>
        </div>
        <div className="row">
          <div className="col text-center radio-fonts">
            <strong>Joining Process: &nbsp;&nbsp;</strong>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  value="Private"
                  checked={this.state.joinProcess === "Private"}
                  onChange={this.handleJoinProcess}
                />{" "}
                Private (on invite)
              </label>
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  value="Public"
                  checked={this.state.joinProcess === "Public"}
                  onChange={this.handleJoinProcess}
                />{" "}
                Public
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Select
              value={this.state.intent}
              options={optionsIntent}
              className="intent-select"
              classNamePrefix="select"
              onChange={this.handleIntent}
            />
          </div>
          <div className="col-md-6">{subIntentPanel}</div>
        </div>
        <div className="row">
          <div className="col">{fileLoadBtn}</div>
        </div>
        <div>{uploadpanel}</div>
        <hr />
        <div className="row">
          <div className="col-7 save_review_msg">
            {this.state.saveReviewMsg}
          </div>
          <div className="col-5">{saveReviewPanel}</div>
        </div>
        <div className="spacing" />
      </div>
    );

    let reviewPanel;
    reviewPanel = (
      <div>
        <div><Review reviewObj={this.state.reviewObject}/></div>
        <div className="row">
          <div className="col-7 save_review_msg">
            {this.state.saveReviewMsg}
          </div>
          <div className="col-5">{saveReviewPanel}</div>
        </div>
        <div className="spacing" />
      </div>
    )

    let showPanel;
    if (!this.state.reviewFlag) {
      showPanel = <div>{topInputPanel}</div>;
    } else {
      showPanel = <div>{reviewPanel}</div>
    }

    return (
      <div>
        {/* <div className="text-center">
          <h6>New Community</h6>
        </div> */}
        <div className="fixedsize_create_comm text-center">{showPanel}</div>
        <ModalContainer />
      </div>
    );
  }
}

NewCreation.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  hideModal: () => dispatch(hideModal()),
  showModal: (modalProps, modalType) => {
    // console.log(
    //   "modalProps:" + JSON.stringify(modalProps) + "  |modalType:" + modalType
    // );
    dispatch(showModal({ modalProps, modalType }));
  }
  // setQAInitDone: () => dispatch(setQAInitDone(userData))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NewCreation));

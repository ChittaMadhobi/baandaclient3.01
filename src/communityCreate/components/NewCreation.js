import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "react-addons-update";

import ReactS3 from "react-s3";
import axios from "axios";

import ModalContainer from "../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../actions/modalActions";
import "../../modal/css/localModal.css";
import "../../modal/css/template.css";

import Select from "react-select";
import { optionsIntent } from "./data/selectOptions";
import { optionsBizIntent } from "./data/bizOptions";
import { optionsColiveIntent } from "./data/coliveOptions";
import { optionsFunstuffIntent } from "./data/funstuffOptions";

import Review from "./Review";

import "./NewCreation.css";
import cosmicDoorway from "./image/cosmicDoorway.jpg";

// **********************************************************
// NOTE: FOR ALL STRING INPUT/ TEXT/TEXTAREA, REPLACE EXTRA SPACES in STRINGS
// via
// string.replace(/\s+/g, ' ').trim()
// *************************** IMPORTANT *************************

// const baandaServer = process.env.REACT_APP_BAANDA_SERVER;

const awsAccessKeyId = process.env.REACT_APP_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.REACT_APP_SECRET_ACCESS_KEY;
const awsRegion = process.env.REACT_APP_AWS_REGION;
const s3BucketName = process.env.REACT_APP_S3_BUCKET_NAME;

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const checkifexistsAPI = "/routes/create/ifCommunityExists?"; // This is a GET
const saveNewCommunityAPI = "/routes/create/saveNewCommunity"; // This is a POST

class NewCreation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      commName: "", // input text  5 to 20 chars
      commCaption: "", // input text 15 - to 50
      commDescription: "", // input textarea 50 to 1000 chars
      joinProcess: "Private", // Radio Button,
      locationType: "Current",
      locationCurr: {},
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
      searchTags: "",
      uploadFileType: "",
      uploadBtnClicked: false,
      uploadMsg: "",
      saveReviewMsg:
        "Please Review and Publish if satisfied. You can Edit later even post publishing.",

      hightlight: false,
      currFilename: "",
      fileNameToDisplay: "",
      disabled: false,

      reviewFlag: false,
      reviewObject: {},

      commNameErrFlag: false,
      commCaptionErrFlag: false,
      commDecriptionErrFlag: false,

      intentErrFlg: false,
      commNameMsg: "A reference name (5-to-20 Chars).",
      commCaptionMsg: "A caption for others (15-to-50 chars).",
      commDescriptionMsg: "Describe your community - (min:50 max:1000 chars)",

      streetAddress: "",
      streetAddressMsg: "Enter street address with unit number (optional)",
      streetAddressErrFlag: false,

      city: "",
      zip: "",
      state: "",
      country: "USA",
      restAddressMsg: "Enter city, zip, state - Country is USA for pilot.",
      restAddressErrFlag: false,

      intentMsg: "Select an intent & focus for the community.",
      searchTagMsg: "Search tags comma (,) delimited (max 100 Chars).",
      picCaptionMsg: "",
      picturesMsg: "Please upload a picture and provide a caption.",
      pictureErrFlag: false,

      saveValidFlag: false,
      reviewValidFlag: false,
      publishValidFlag: false,
      savedFlag: false
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

  async componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push('/login');
    }
    let retdata;
    try {
      let url = "https://ipapi.co/json/";
      retdata = await axios.get(url);
      if (!retdata.data) {
        throw new Error(
          "Geocentric return data not availabe for api = https://ipapi.co/json/"
        );
      } else {
        this.setState({
          locationCurr: retdata.data
        });
      }
      // console.log("retdata:", retdata.data);
    } catch (err) {
      console.log("Get geodata error:", err);
    }
    // console.log("retdata: ", retdata);
  }
  uploadToS3 = async e => {
    let dirname = "bid" + this.props.auth.user.baandaId;
    let config = {
      bucketName: s3BucketName,
      dirName: dirname,
      region: awsRegion,
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey
    };
    // console.log("Uplading file: ", this.state.currFilename);
    // console.log("config: ", config);
    // let index;
    // // pic=0, vedio=1, & audio=2 -- only three kinds now & pic is active.
    // if (this.state.uploadFileType === "pic") {
    //   index = 0;
    // } else if (this.state.uploadFileType === "vedio") {
    //   index = 1;
    // } else {
    //   index = 2;
    // }
    // console.log("index :", index);

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
      let filename;
      if (s3fileObject.key) {
        filename = s3fileObject.key.split(/(\\|\/)/g).pop();
      }
      // console.log("Data:", data, " s3fileObject:", s3fileObject);
      // this.setState(prevState => ({
      //   fileUploads: {
      //     ...prevState.fileUploads, [prevState.fileUploads[index]]: s3fileObject
      //   }
      // }))
      await this.setState({
        fileUploads: update(this.state.fileUploads, {
          0: { $set: s3fileObject }
        }),
        fileNameToDisplay: filename + " successfully upload",
        saveReviewMsg:
          "File uploaded. Please Save. Review and publish now, or later when ready."
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
    let index;
    // pic=0, vedio=1, & audio=2 -- only three kinds now & pic is active.
    if (this.state.uploadFileType === "pic") {
      index = 0;
    } else if (this.state.uploadFileType === "vedio") {
      index = 1;
    } else {
      index = 2;
    }
    const files = evt.target.files;
    await this.setState({
      currFilename: files[index],
      fileNameToDisplay: "Ready to upload: " + files[index].name
    });

    // console.log("filename:", this.state.fileNameToDisplay);
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
    // console.log("In drop zone");
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
    // console.log("files: ", files);
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
    // let name = [e.target.name];
    // let value = e.target.value;
    await this.setState({ [e.target.name]: e.target.value });

    // console.log('onChange name:', name, ' value:', value);
  }

  async handleJoinProcess(e) {
    await this.setState({
      joinProcess: e.target.value
    });
  }

  handlelocationType = async e => {
    await this.setState({
      locationType: e.target.value
    });
  };

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
    // console.log("upload type:", type);
    await this.setState({
      uploadFileType: type,
      uploadBtnClicked: true,
      uploadMsg: "Click, Tap, or Darg'n-Drop."
    });
  };

  checkCreationInputs = async () => {
    let valid = await this.saveValidation();
    if (valid) {
      await this.setState({
        saveValidFlag: false,
        saveReviewMsg:
          "Please Review and Publish if satisfied. You can Edit later even post publishing."
      });
    } else {
      await this.setState({
        saveValidFlag: true,
        saveReviewMsg:
          "Your entries need to be valid to save. Check field level errors."
      });
    }
  };

  // Validate whether the form can be saved even partially.
  saveValidation = async () => {
    let isValid = true;
    let v = this.state.commName.trim().length;
    if (v < 5) {
      // console.log("in commName  v < 5: ", v);
      await this.setState({
        commNameMsg: "The name is short. Should be between 5 to 20.",
        commNameErrFlag: true
      });
      isValid = false;
    } else {
      await this.setState({
        commNameMsg: "A reference name (5-to-20 Chars).",
        commNameErrFlag: false
      });
    }

    if (isValid) {
      // check if bthis.props.auth.user.baandaId +  this.state.commName.trim()
      // exists in DB
      // console.log('!isValid: ', isValid);
      let check = await this.checkIfExists();
      if (!check) {
        isValid = false;
        await this.setState({
          commNameMsg:
            "The name already exists. Try a new name or click Edit to modify.",
          commNameErrFlag: true
        });
      }
    }

    v = this.state.commCaption.trim().length;
    if (v < 15) {
      await this.setState({
        commCaptionMsg: "The caption is short. Should be between 15 to 50.",
        commCaptionErrFlag: true
      });
      isValid = true;
    } else {
      await this.setState({
        commCaptionMsg: "A caption for others (15-to-50 chars).",
        commCaptionErrFlag: false
      });
    }
    v = this.state.commDescription.trim().length;
    if (v < 15) {
      await this.setState({
        commDescriptionMsg:
          "Description is short. Should be between 50 to 1000. Now lenght is " +
          this.state.commDescription.trim().length,
        commDecriptionErrFlag: true
      });
      isValid = false;
    } else {
      await this.setState({
        commDescriptionMsg: "Describe your community - (min:50 max:1000 chars)",
        commDecriptionErrFlag: false
      });
    }

    if (!this.state.intent && !this.state.subIntent) {
      await this.setState({
        intentMsg: "Must select the intent and focus of your community.",
        intentErrFlag: true
      });
      isValid = false;
    } else {
      await this.setState({
        intentMsg: "Select an intent & focus for the community.",
        intentErrFlag: false
      });
    }

    if (
      this.state.fileUploads[0].s3Url === "" ||
      this.state.picCaption === ""
    )
    // if (
    //   this.state.fileUploads[0].s3Url === "" 
    // )
     {
      await this.setState({
        pictureMsg: "Must upload a picture & enter a caption.",
        pictureErrFlag: true
      });
      isValid = false;
    } else {
      await this.setState({
        pictureMsg: "Upload a picture and provide a caption.",
        pictureErrFlag: false
      });
    }

    return isValid;
  };

  // Call API to check if baandaid+commName exists.
  checkIfExists = async () => {
    let ifExists = true;
    let params =
      "baandaid=" +
      this.props.auth.user.baandaId +
      "&commName=" +
      this.state.commName;
    let url = baandaServer + checkifexistsAPI + params;
    try {
      let ret = await axios.get(url);
      if (ret.data.status === "Fail") {
        throw new Error(`Commune name already exists ${this.state.commName}`);
      }
    } catch (err) {
      console.log('err:', err.message);
      ifExists = false;
    }

    return ifExists;
  };

  // Call API to save community
  savePublishInDB = async () => {
    // saveNewCommunityAPI
    let url = baandaServer + saveNewCommunityAPI;
    let commData = {
      baandaid: this.props.auth.user.baandaId,
      commName: this.state.commName,
      commCaption: this.state.commCaption,
      commDescription: this.state.commDescription,
      intent: this.state.intent.value,
      focus: this.state.subIntent.value,
      searchWords: this.state.searchTags,
      joiningProcess: this.state.joinProcess,
      locationType: this.state.locationType,
      locationCurr: this.state.locationCurr,
      postalAddress: {
        street: this.state.streetAddress,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip,
        country: this.state.country
      },
      fileUploads: {
        key: this.state.fileUploads[0].key,
        type: this.state.fileUploads[0].contentType,
        s3Url: this.state.fileUploads[0].s3Url,
        caption: this.state.picCaption
      }
    };
    console.log('savePublishInDB url:', url);
    console.log('savePublishInDB Data:', commData);
    try {
      let ret = await axios.post(url, commData);
      if (ret.length === 0) {
        throw new Error(
          "Did not save ... something wrong. Check with engineers."
        );
      } else {
        await this.setState({
          savedFlag: true,
          saveReviewMsg:
            "Successfully published. Click Home on Navbar/Side Drawer and then click on Engage."
        });
        // console.log('Saved message successfully ...');
      }
    } catch (err) {
      console.log('savePublishInDB save error: ', err.message);
    }
  };

  // Validate whethere the form is ready for publishing
  publishComm = async () => {

    let valid = await this.saveValidation();
    if (valid) {
      try {
        let pubret = await this.savePublishInDB();
        console.log('publishComm:', pubret);
        if ( pubret.status === 'Success') {
          await this.setState({
            saveValidFlag: true,
            saveReviewMsg:
              "Successfully published. This will be available in your Engage (Dashboard). "
          });
        } else {
          await this.setState({
            saveValidFlag: false,
            saveReviewMsg:
              `Error: Problem saving. Report to baanda support jit@baanda.com with the msg: ${pubret.Msg}`
          });
        }
      } catch (err) {
        console.log("publish comm err:", err);
      }
      // Here we need to push one to the lobby
      // this.props.history.push('/lobby');
      // await this.setState({
      //   saveValidFlag: false,
      //   saveReviewMsg:
      //     "Successfully published. This will be available in your Engage (Dashboard). "
      // });
    } else {
      await this.setState({
        saveValidFlag: true,
        saveReviewMsg:
          "The Creation is incomplete. Please Edit, Save to check errors, fix and then publish."
      });
    }
  };

  // Redirect to Home / lobby
  savedNowClose = () => {
    this.props.history.push("/lobby");
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
      searchTags: this.state.searchTags,
      picCaption: this.state.picCaption,
      locationType: this.state.locationType,
      locationCurr: this.state.locationCurr,
      postalAddress: {
        street: this.state.streetAddress,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip,
        country: this.state.country
      }
    };
    await this.setState({
      reviewFlag: true,
      saveReviewMsg:
        "To be available in your dashboard for details setup, please Publish first.",
      reviewObject: revobj
    });
  };

  editCreation = async () => {
    await this.setState({
      reviewFlag: false
    });
  };

  render() {
    // console.log("NewCreation.js this.state create: ", this.state);
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
    if (!this.state.reviewFlag) {
      // Edit mode
      saveReviewPanel = (
        <div>
          <button
            className="btn-savereview_xx"
            type="button"
            onClick={this.checkCreationInputs}
            style={{ cursor: this.state.disabled ? "default" : "pointer" }}
          >
            <b>Validate</b>
          </button>
          &nbsp;&nbsp;
          <button
            className="btn-savereview_xx"
            type="button"
            onClick={this.reviewBeforeSave}
            style={{ cursor: this.state.disabled ? "default" : "pointer" }}
          >
            <b>Review</b>
          </button>
        </div>
      );
    } else {
      if (!this.state.savedFlag) {
        saveReviewPanel = (
          <div>
            <button
              className="btn-savereview_xx"
              type="button"
              onClick={this.editCreation}
              style={{ cursor: this.state.disabled ? "default" : "pointer" }}
            >
              <b>Edit</b>
            </button>
            &nbsp;&nbsp;
            <button
              className="btn-savereview_xx"
              type="button"
              onClick={this.publishComm}
              style={{ cursor: this.state.disabled ? "default" : "pointer" }}
            >
              <b>Publish</b>
            </button>
          </div>
        );
      } else {
        saveReviewPanel = (
          <div>
            <button
              className="btn-savereview_xx"
              type="button"
              onClick={this.savedNowClose}
              style={{ cursor: this.state.disabled ? "default" : "pointer" }}
            >
              <b>Close</b>
            </button>
          </div>
        );
      }
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
                value={this.state.picCaption}
                required
              />
              <p className="pic_caption_msg">{this.state.picCaptionMsg}</p>
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
          <div
            className={`${
              !this.state.pictureErrFlag
                ? "save_review_msg pic_msg_placement"
                : "save_review_msg_err pic_msg_placement"
            }`}
          >
            <p>{this.state.picturesMsg}</p>
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

    let postalAddressPanel = null;
    if (this.state.locationType === "Postal") {
      postalAddressPanel = (
        <div className="text-center">
          <div className="row">
            <div className="col input_text_creation_caption">
              <input
                name="streetAddress"
                type="text"
                value={this.state.streetAddress}
                onChange={this.onChange}
                size="45"
                maxLength="40"
                className="input_text_street"
                placeholder="Your postal street address ..."
              />
              <div
                className={`${
                  !this.state.streetAddressErrFlag
                    ? "save_review_msg"
                    : "save_review_msg_err"
                }`}
              >
                <p>{this.state.streetAddressMsg}</p>
              </div>
            </div>
            <div className="row input_text_address">
              <div className="col-6">
                <input
                  name="city"
                  type="text"
                  value={this.state.city}
                  onChange={this.onChange}
                  size="20"
                  maxLength="40"
                  className="input_text_city"
                  placeholder="City ... "
                />
              </div>
              <div className="col-2 input_text_zip_col">
                <input
                  name="state"
                  type="text"
                  value={this.state.state}
                  onChange={this.onChange}
                  size="3"
                  maxLength="2"
                  className="input_text_state"
                  placeholder="State"
                />
              </div>
              {/* <div className="col-1">&nbsp;</div> */}
              <div className="col-4 input_text_zip_col">
                <input
                  name="zip"
                  type="text"
                  value={this.state.zip}
                  onChange={this.onChange}
                  size="5"
                  maxLength="5"
                  className="input_text_zip"
                  placeholder="Zip"
                />
              </div>
            </div>
          </div>
          <div
            className={`${
              !this.state.restAddressErrFlag
                ? "save_review_msg"
                : "save_review_msg_err"
            }`}
          >
            <p>{this.state.restAddressMsg}</p>
          </div>
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
            <div
              className={`${
                !this.state.commNameErrFlag
                  ? "save_review_msg"
                  : "save_review_msg_err"
              }`}
            >
              <p>{this.state.commNameMsg}</p>
            </div>
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
            <div
              className={`${
                !this.state.commCaptionErrFlag
                  ? "save_review_msg"
                  : "save_review_msg_err"
              }`}
            >
              <p>{this.state.commCaptionMsg}</p>
            </div>
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
              value={this.state.commDescription}
              required
            />
            <div
              className={`${
                !this.state.commDecriptionErrFlag
                  ? "save_review_msg"
                  : "save_review_msg_err"
              }`}
            >
              <p>{this.state.commDescriptionMsg}</p>
            </div>
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
          <div className="col text-center radio-fonts">
            <strong>Geo-Location: &nbsp;&nbsp;</strong>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  value="Current"
                  checked={this.state.locationType === "Current"}
                  onChange={this.handlelocationType}
                />{" "}
                Current
              </label>
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  value="Postal"
                  checked={this.state.locationType === "Postal"}
                  onChange={this.handlelocationType}
                />{" "}
                Postal
              </label>
            </div>
            <div className="form-check form-check-inline">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  value="Virtual"
                  checked={this.state.locationType === "Virtual"}
                  onChange={this.handlelocationType}
                />{" "}
                Virtual
              </label>
            </div>
          </div>
        </div>
        {postalAddressPanel}
        <p align="justify" className="intent_msg">
          Please select your intent and intent's focus:
        </p>
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
        <div
          className={`${
            !this.state.intentErrFlag
              ? "save_review_msg"
              : "save_review_msg_err"
          }`}
        >
          <p>{this.state.intentMsg}</p>
        </div>
        <div className="row">
          <div className="col input_text_searchtags">
            <input
              name="searchTags"
              type="text"
              value={this.state.searchTags}
              onChange={this.onChange}
              size="48"
              maxLength="100"
              className="input_text_search"
              placeholder="Comma delimited search words or phrases ..."
            />
            <small className="field_msg">
              <p>{this.state.searchTagMsg}</p>
            </small>
          </div>
        </div>
        <div className="row">
          <div className="col">{fileLoadBtn}</div>
        </div>
        <div>{uploadpanel}</div>
        <hr />
        <div className="row">
          <div className="col-7">
            <div
              className={`${
                !this.state.saveValidFlag
                  ? "save_review_msg"
                  : "save_review_msg_err"
              }`}
            >
              <b>{this.state.saveReviewMsg}</b>
            </div>
          </div>
          <div className="col-5">{saveReviewPanel}</div>
        </div>
        <div className="spacing" />
      </div>
    );

    let reviewPanel;
    reviewPanel = (
      <div>
        <div>
          <Review reviewObj={this.state.reviewObject} />
        </div>
        <div className="row">
          <div className="col-7">
            <div
              className={`${
                !this.state.saveValidFlag
                  ? "save_review_msg"
                  : "save_review_msg_err"
              }`}
            >
              {this.state.saveReviewMsg}
            </div>
          </div>
          <div className="col-5">{saveReviewPanel}</div>
        </div>
        <div className="spacing" />
      </div>
    );

    let showPanel;
    if (!this.state.reviewFlag) {
      showPanel = <div>{topInputPanel}</div>;
    } else {
      showPanel = <div>{reviewPanel}</div>;
    }

    // let testpanel = (
    //   <div>
    //     <p align="justify">1. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
    //     <p align="justify">2. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
    //     <p align="justify">3. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
    //     <p align="justify">4. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>

    //   </div>
    // )
    return (
      <div>
        {/* <div className="text-center">
          <h6>New Community</h6>
        </div> */}
        <div className="fixedsize_create_comm text-center">{showPanel}</div>
        {/* <div className="fixedsize_create_comm_x">{testpanel}</div> */}
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

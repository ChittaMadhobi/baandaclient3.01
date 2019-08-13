import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "react-addons-update";

import ReactS3 from "react-s3";
// import axios from "axios";

import ModalContainer from "../../../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../../../actions/modalActions";
import "../../../../modal/css/localModal.css";
import "../../../../modal/css/template.css";

import cosmicDoorway from "../../market/image/cosmicDoorway.jpg";
// import Select from "react-select";
import "./Catalog.css";

const awsAccessKeyId = process.env.REACT_APP_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.REACT_APP_SECRET_ACCESS_KEY;
const awsRegion = process.env.REACT_APP_AWS_REGION;
const s3BucketName = process.env.REACT_APP_S3_BUCKET_NAME;

// const baandaServer = process.env.REACT_APP_BAANDA_SERVER;

class Catalog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",

      merchandiseType: "Goods",

      itemName: "",
      itemNameMsg: "A unique item name between 10 to 100 chars",
      itemNameErrFlag: false,

      itemDescription: "",
      itemDecriptionErrFlag: "",
      itemDescriptionMsg:
        "Enter the description for the users. ",

      unitType: "Number",

      createCatalogFlag: true,
      editCatalogFlag: false,

      uploadBtnClicked: false,
      uploadFileType: "",
      fileNameToDisplay: "",
      picCaption: "",
      picCaptionMsg: "",
      picturesMsg: "Please upload a picture and provide a caption.",
      pictureErrFlag: false,
      saveReviewMsg:
        "Please click Save to save & go to next entry. When finished entering, click Close."
    };

    this.fileInputRef = React.createRef();
    this.openFileDialog = this.openFileDialog.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  openAlertModal = () => {
    let msg = {
      Header: "Your Catalog",
      Body: {
        oneLineSummary: `This is where you enter in your catalog.`,
        steps: [
          {
            step: "Catalog",
            stepNote:
              "Catalog lets you enter new items your catalog and edit them. Only creator and adminstrators can manage catalog."
          }
        ],
        footnote: "Footnote on Catalog module only."
      },
      Footer: "This is the footer"
    };
    this.props.showModal(
      {
        open: true,
        title: "Alert - Start Here Header",
        message: msg,
        closeModal: this.closeModal
      },
      "infoModal"
    );
  };

  handleEdit = async () => {
    // alert("Edit");
    await this.setState({
      createCatalogFlag: false,
      editCatalogFlag: true
    });
  };

  handleNew = async () => {
    // alert('ENew');
    await this.setState({
      createCatalogFlag: true,
      editCatalogFlag: false
    });
  };

  handleMerchandiseType = async e => {
    await this.setState({
      merchandiseType: e.target.value
    });
  };

  handleUnitType = async e => {
    await this.setState({
      unitType: e.target.value
    });
  };

  onChange = async e => {
    await this.setState({ [e.target.name]: e.target.value });
  };

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
      //   console.log("Data:", data, " s3fileObject:", s3fileObject);

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

  setUploadType = async type => {
    console.log("upload type:", type);
    await this.setState({
      uploadFileType: type,
      uploadBtnClicked: true,
      uploadMsg: "Click, Tap, or Darg'n-Drop."
    });
  };
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

  validateAndSave = () => {
    alert("validate and save and next");
  };

  returnToAccessList = () => {
    alert("return to access List");
  };

  render() {
    let catalogbuttons;
    if (this.state.createCatalogFlag) {
      catalogbuttons = (
        <div>
          <div className="row">
            <div className="col-6 header_text_style">New Catalog Entry</div>
            <div className="col-6">
              <button
                className="btn_catalog"
                type="button"
                onClick={() => this.handleEdit()}
              >
                <b>Edit</b>
              </button>
              &nbsp;
              <button
                className="btn-modal_catalog"
                type="button"
                onClick={this.openAlertModal}
              >
                <i className="fas fa-info-circle" />
                {/* <b>Info</b> */}
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      catalogbuttons = (
        <div>
          <div className="row">
            <div className="col-6 header_text_style">Edit Catalog Entries</div>
            <div className="col-6">
              <button
                className="btn_catalog"
                type="button"
                onClick={() => this.handleNew()}
              >
                <b>Entry</b>
              </button>
              &nbsp;
              <button
                className="btn-modal_catalog"
                type="button"
                onClick={this.openAlertModal}
              >
                <i className="fas fa-info-circle" />
                {/* <b>Info</b> */}
              </button>
            </div>
          </div>
        </div>
      );
    }

    let fileLoadBtn;
    fileLoadBtn = (
      <div className="file_load_btn_positions">
        <span>
          <b>Upload Type:</b>&nbsp;
          <button
            className="btn-upload-catalog-active"
            type="button"
            onClick={() => this.setUploadType("pic")}
            style={{ cursor: this.state.disabled ? "default" : "pointer" }}
          >
            <b>Picture</b>
          </button>
          &nbsp;&nbsp;
          <button
            className="btn-upload-catalog-inactive"
            type="button"
            onClick={() => this.setUploadType("vedio")}
            disabled
          >
            <b>Vedio</b>
          </button>
          &nbsp;&nbsp;
          <button
            className="btn-upload-catalog-inactive"
            type="button"
            onClick={() => this.setUploadType("audio")}
            disabled
          >
            <b>Audio</b>
          </button>
          &nbsp;&nbsp;
          <button
            className="btn-upload-catalog-inactive"
            type="button"
            onClick={() => this.setUploadType("pdf")}
            disabled
          >
            <b>PDF</b>
          </button>
        </span>
      </div>
    );

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
            <div className="col-6 upload_message_catalog">
              &nbsp;
              <p>{this.state.uploadMsg}</p>
              <textarea
                name="picCaption"
                maxLength="50"
                placeholder="Caption of the picture."
                rows="2"
                wrap="hard"
                spellCheck="true"
                className="pic_caption_textarea"
                onChange={this.onChange}
                value={this.state.picCaption}
                required
              />
              <p className="pic_caption_msg_catalog">{this.state.picCaptionMsg}</p>
              <p className="pic_caption_msg_catalog">
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

    let saveReviewPanel;

    saveReviewPanel = (
      <div className="save_btn_placement">
        <button
          className="btn-savereview_yy"
          type="button"
          onClick={this.validateAndSave}
          style={{ cursor: this.state.disabled ? "default" : "pointer" }}
        >
          <b>Save</b>
        </button>
        &nbsp;&nbsp;
        <button
          className="btn-savereview_yy"
          type="button"
          onClick={this.returnToAccessList}
          style={{ cursor: this.state.disabled ? "default" : "pointer" }}
        >
          <b>Close</b>
        </button>
      </div>
    );

    let createCatalogPanel;
    if (this.state.createCatalogFlag) {
      createCatalogPanel = (
        <div>
          {catalogbuttons}
          <div className="space-before-form" />
          <div className="row">
            <div className="col text-center radio-catlog-fonts">
              <strong>Merchandise Type: &nbsp;&nbsp;</strong>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="Goods"
                    checked={this.state.merchandiseType === "Goods"}
                    onChange={this.handleMerchandiseType}
                  />{" "}
                  Goods
                </label>
              </div>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="Service"
                    checked={this.state.merchandiseType === "Service"}
                    onChange={this.handleMerchandiseType}
                  />{" "}
                  Services
                </label>
              </div>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="Goods&Service"
                    checked={this.state.merchandiseType === "Goods&Service"}
                    onChange={this.handleMerchandiseType}
                  />{" "}
                  Goods&Services
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col input_placement">
              <input
                name="itemName"
                type="text"
                value={this.state.itemName}
                onChange={this.onChange}
                size="50"
                maxLength="50"
                className="input_text_catlog"
                placeholder="Enter a unique item name"
              />
              <div
                className={`${
                  !this.state.itemNameErrFlag
                    ? "catalog_input_msg"
                    : "catalog_input_msg_err"
                }`}
              >
                <p>{this.state.itemNameMsg}</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col text-center">
              <textarea
                name="itemDescription"
                maxLength="1000"
                placeholder="Write short description of the item."
                rows="4"
                //   cols="50"
                wrap="hard"
                spellCheck="true"
                className="input_textarea_desc"
                onChange={this.onChange}
                value={this.state.itemDescription}
                required
              />
              <div
                className={`${
                  !this.state.itemDecriptionErrFlag
                    ? "catalog_input_msg text-center"
                    : "catalog_input_msg_err text-center"
                }`}
              >
                <p>{this.state.itemDescriptionMsg}</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col text-center radio-catlog-units">
              <strong>Unit Type: &nbsp;&nbsp;</strong>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="Number"
                    checked={this.state.unitType === "Number"}
                    onChange={this.handleUnitType}
                  />{" "}
                  Each
                </label>
              </div>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="Volume"
                    checked={this.state.unitType === "Volume"}
                    onChange={this.handleUnitType}
                  />{" "}
                  Volume
                </label>
              </div>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="Weight"
                    checked={this.state.unitType === "Weight"}
                    onChange={this.handleUnitType}
                  />{" "}
                  Weight
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col text-center">{fileLoadBtn}</div>
          </div>
          <div>{uploadpanel}</div>
          <hr />
          <div className="row">
            <div className="col-7 save_close_msg_placement">
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
    }

    return (
      <div className="fixedsize_catalog">
        {createCatalogPanel}
        <ModalContainer />
      </div>
    );
  }
}

Catalog.propTypes = {
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
)(withRouter(Catalog));

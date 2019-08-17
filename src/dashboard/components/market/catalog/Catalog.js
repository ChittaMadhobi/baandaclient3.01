import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import update from "react-addons-update";

import ReactS3 from "react-s3";
import axios from "axios";

import _ from "lodash";

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

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const ifItemExistsAPI = "/routes/dashboard/ifCatalogItemExists?";
const saveItemAPI = "/routes/dashboard/saveCatalogItem";

class Catalog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",

      merchandiseType: "Goods",

      itemName: "",
      itemNameMsg: "A unique item name between 10 to 100 chars",
      itemNameErrFlag: false,

      itemCategory: "",
      itemCategoryMsg: "Item category. May be same for set of entry.",
      itemCategoryErrFlag: false,

      itemDescription: "",
      itemDecriptionErrFlag: "",
      itemDescriptionMsg: "Enter the description (50 to 1000 characters). ",

      unitType: "Number",
      itemPrice: 0.00,
      itemPriceMsg: "Enter the price of the item (0.00)$",
      itemPriceErrFlag: false,

      createCatalogFlag: true,
      editCatalogFlag: false,

      fileUploads: [
        {
          contentType: "", // audio, video, pdf, pic
          // bucket: "",
          // dirname: "",
          key: "",
          caption: "",
          s3Url: ""
        }
      ],
      uploadBtnClicked: false,
      uploadFileType: "",
      fileNameToDisplay: "",
      picCaption: "",
      picCaptionMsg: "",
      picturesMsg: "Please upload a picture and provide a caption.",
      pictureErrFlag: false,
      saveReviewMsg:
        "Click Save to validate, save, & go for the next item entry. Close to return.",
      saveValidFlag: false  
    };

    this.fileInputRef = React.createRef();
    this.onFilesAdded = this.onFilesAdded.bind(this);
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
    console.log('name: ', [e.target.name], ' value:', e.target.value)
    await this.setState({ [e.target.name]: e.target.value });
    console.log('itemPrice:', this.state.itemPrice);
  };

  // onChangePrice = async e => {
  //   let val = parseFloat(e.target.value).toFixed(2);
  //   console.log('val:', val);
  //   await this.setState({ [e.target.name]: e.target.value });
  //   // await this.setState({ [e.target.name]: val });
  // };
  uploadToS3 = async e => {
    let dirname = "commid" + this.props.communityid;
    let config = {
      bucketName: s3BucketName,
      dirName: dirname,
      region: awsRegion,
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsSecretAccessKey
    };
    // console.log('uploadToS3 config:', config, ' filename:', this.state.currFilename);
    try {
      let data = await ReactS3.uploadFile(this.state.currFilename, config);
      // let s3fileObject = {
      //   contentType: this.state.uploadFileType,
      //   bucket: data.bucket,
      //   dirname: dirname,
      //   key: data.key,
      //   caption: this.state.picCaption,
      //   s3Url: data.location
      // };
      let s3fileObject = {
        type: this.state.uploadFileType,
        key: data.key,
        caption: this.state.picCaption,
        s3Url: data.location
      };
      let filename;
      if (s3fileObject.key) {
        filename = s3fileObject.key.split(/(\\|\/)/g).pop();
      }
      console.log("Data:", data, " s3fileObject:", s3fileObject);

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

  validateAndSave = async () => {
    // alert("validateAndSave function");
    let price = 0;
    if (_.isString(this.state.itemPrice)) {
      // console.log ('this is string:', this.state.itemPrice)
      if ( this.state.itemPrice === "0" || this.state.itemPrice === "") {
        price = 0;
      } else {
        price = parseFloat(this.state.itemPrice).toFixed(2);
      }
    } else if (!isNaN(this.state.itemPrice)){
      // console.log('This is a number:', this.state.itemPrice);
      if ( this.state.itemPrice === 0) {
        price = 0;
        // console.log('price  set to 0');
      } else {
        price = this.state.itemPrice.toFixed(2);
        // console.log('price  set to: ', price);
      }
    } 

    console.log('$$$ price: ', price, ' this.state.itemPrice:', this.state.itemPrice);
    let data = {
      communityId: this.props.communityid,
      commName: this.props.commName,
      baandaId: this.props.auth.user.baandaId,
      merchandiseType: this.state.merchandiseType,
      itemName: this.state.itemName,
      itemCategory: this.state.itemCategory,
      itemDescription: this.state.itemDescription,
      unitType: this.state.unitType,
      itemPrice: price,
      fileUploads: this.state.fileUploads
    };

    console.log("data:", data);

    let valid = await this.validateItem(data);
    // console.log("valid:", valid);
    if (valid) {
      // this.saveItem(data);
      console.log("valid: /////////");
      let response = await this.saveItem(data);
      console.log('SaveItem Response:', response);
      await this.setState({
        saveReviewMsg: 'Saved. Please enter the next item. Close to return.',
        saveValidFlag: false,
        itemName: '',
        itemDescription: '',
        itemPrice: 0.00,
        fileUploads: [
          {
            contentType: "", 
            key: "",
            caption: "",
            s3Url: ""
          }
        ],
        picCaption: '',
        fileNameToDisplay: '',
      })
    } 
  };

  validateItem = async data => {
    console.log("save validate data:", data);
    let isValid = true;

    // Check item Name
    if (data.itemName.length < 10) {
      await this.setState({
        itemNameMsg: "Item name should be at least 10 chars long.",
        itemNameErrFlag: true
      });
      isValid = false;
    } else {
      let valid = await this.checkIfItemExists(data.communityId, data.itemName);
      if (!valid) {
        await this.setState({
          itemNameMsg: "The item name exists. Please Edit to modify.",
          itemNameErrFlag: true
        });
        isValid = false;
      } else {
        await this.setState({
          itemNameMsg: "A unique item name between 10 to 100 chars.",
          itemNameErrFlag: false
        });
      }
    }

    // Description
    if (data.itemDescription.length < 50) {
      await this.setState({
        itemDescriptionMsg: "Description should be at least 50 chars long.",
        itemDecriptionErrFlag: true
      });
      isValid = false;
    } else {
      await this.setState({
        itemDescriptionMsg: "Enter Description (50 to 1000 characters).",
        itemDecriptionErrFlag: false
      });
    }

    // Price
    console.log('price:', data.itemPrice);
    if (data.itemPrice === 0) {
      await this.setState({
        itemPriceMsg: "Item must have a price.",
        itemPriceErrFlag: true
      });
      isValid = false;
    } else {
      await this.setState({
        itemPriceMsg: "Enter the price of the item (0.00)$",
        itemPriceErrFlag: false
      });
    }

    return isValid;
  };

  saveItem = async data => {
    let url = baandaServer + saveItemAPI;
    console.log("All OK ... ready to save - url: ", url);

    let retData;
    try {
      retData = await axios.post(url, data);
      console.log("retData:", retData);
      return true;
    } catch (err) {
      console.log("save Item err:", err.message);
      await this.setState({
        saveReviewMsg: 'Failed: ' + err.message + 'Please contact Baanda support at info@baanda.com.',
        saveValidFlag: true
      });
    }
  };

  checkIfItemExists = async (communityId, itemName) => {
    console.log(
      " checkifItemExists communityId:" + communityId,
      " itemName:" + itemName
    );
    let ifExists = true;
    let params = "communityId=" + communityId + "&itemName=" + itemName;
    let url = baandaServer + ifItemExistsAPI + params;
    console.log("if exists get url:", url);
    try {
      let ret = await axios.get(url);
      if (ret.data.status === "Fail") {
        // console.log('msg:', ret.data.Msg);
        throw new Error(`Item name already exists`);
      }
      // else {
      //   console.log('ret msg:', ret.data.status);
      // }
    } catch (err) {
      console.log("err:", err.message);
      ifExists = false;
    }

    return ifExists;
  };

  returnToAccessList = () => {
    alert("return to access List");
  };

  render() {
    // console.log("catalog props:", this.props);
    console.log('state:', this.state);

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
              <p className="pic_caption_msg_catalog">
                {this.state.picCaptionMsg}
              </p>
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
            <div className="col input_placement">
              <input
                name="itemCategory"
                type="text"
                value={this.state.itemCategory}
                onChange={this.onChange}
                size="50"
                maxLength="50"
                className="input_text_catlog"
                placeholder="Category of your item ..."
              />
              <div
                className={`${
                  !this.state.itemCategoryErrFlag
                    ? "catalog_input_msg"
                    : "catalog_input_msg_err"
                }`}
              >
                <p>{this.state.itemCategoryMsg}</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col text-center input_placement_desc">
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
                  <b>Each</b>
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
                    disabled
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
                    disabled
                  />{" "}
                  Weight
                </label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right price_word">
              <b>Price</b>
            </div>
            <div className="col-4 input_placement text-left">
              <input
                name="itemPrice"
                type="number"
                min="0.00"
                value={this.state.itemPrice}
                onChange={this.onChange}
                size="20"
                // maxLength="50"
                className="input_price_field"
                step=".01"
                placeholder="0.00"
                autoComplete="off"
                // pattern="^\d*(\.\d{0,2})?$"
              />
            </div>
            <div className="col-3 text-left price_word_s">
              <b>$</b> Each
            </div>
            <div className="col-1">&nbsp;</div>
          </div>
          <div className="row">
            <div className="col">
              <div
                className={`${
                  !this.state.itemPriceErrFlag
                    ? "catalog_input_msg"
                    : "catalog_input_msg_err"
                }`}
              >
                <p className="item_price_msg">{this.state.itemPriceMsg}</p>
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

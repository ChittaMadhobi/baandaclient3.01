import React, { Component } from "react";

import "./Review.css";

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ""
    };
  }

  render() {
    console.log("this.props review:", this.props);
    console.log("s3url:", this.props.reviewObj.fileUploads[0].s3Url);
    let imgSrc, imgCaption;
    if (this.props.reviewObj.fileUploads[0].s3Url) {
      imgSrc = this.props.reviewObj.fileUploads[0].s3Url;
      imgCaption = this.props.reviewObj.fileUploads[0].caption;
    }

    let picPanel;
    if (!imgSrc) {
      picPanel = (
        <div>
          <p className="text-center top_of_card_rev">{imgCaption}</p>
          <font color="red"><p>No picture has been uploaded</p></font>
        </div>
      );
    } else {
      picPanel = (
        <div>
          <p className="text-center top_of_card_rev">{imgCaption}</p>
          <img alt="upload" className="icon_rev" src={imgSrc} />
        </div>
      );
    }
    return (
      <div className="review_text">
        <div className="row">
          <div className="col-3 text-left">
            <b>Ref. Name:</b>
          </div>
          <div className="col-9">
            <p align="justify">{this.props.reviewObj.commName}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-3 text-left">
            <b>Caption:</b>
          </div>
          <div className="col-9">
            <p align="justify">{this.props.reviewObj.commCaption}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-3 text-left">
            <b>Description:</b>
          </div>
          <div className="col-9">
            <p align="justify">{this.props.reviewObj.commDescription}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-3 text-left">
            <b>Intent:</b>
          </div>
          <div className="col-9">
            <p align="justify">{this.props.reviewObj.intent.label} </p>
          </div>
        </div>
        <div className="row">
          <div className="col-3 text-left">
            <b>Focus:&nbsp;</b>
          </div>
          <div className="col-9">
            <p align="justify">{this.props.reviewObj.subIntent.label}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-3 text-left">
            <b>Search Tags:&nbsp;</b>
          </div>
          <div className="col-9">
            <p align="justify">{this.props.reviewObj.searchTags}</p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="picture_review_card">
              {/* <p className="text-center top_of_card_rev">{imgCaption}</p>
              <img alt="upload" className="icon_rev" src={imgSrc} /> */}
              {picPanel}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Review;

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
    console.log("this.props review:", this.props.reviewObj);
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
          <font color="red">
            <p>No picture has been uploaded</p>
          </font>
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

    let locationPanel = null;
    if (this.props.reviewObj.locationType === "Current") {
      console.log("======>> Current:", this.props.reviewObj.locationCurr);
      let loc = this.props.reviewObj.locationCurr;
      locationPanel = (
        <div>
          <p align="justify">City:&nbsp;{loc.city}</p>
          <p align="justify">Country:&nbsp;{loc.country_name}</p>
          <p align="justify">Currency:&nbsp;{loc.currency}</p>
          <p align="justify">Language:&nbsp;{loc.languages}</p>
          <p align="justify">Latitude:&nbsp;{loc.latitude}</p>
          <p align="justify">Longitude:&nbsp;{loc.longitude}</p>
          <p align="justify">Region:&nbsp;{loc.region}</p>
          <p align="justify">Zip code:&nbsp;{loc.postal}</p>
          <p align="justify">
            Time zone:&nbsp;{loc.timezone} with GMT offset {loc.utc_offset}
          </p>
        </div>
      );
    } else if (this.props.reviewObj.locationType === "Postal") {
      let pa = this.props.reviewObj.postalAddress;
      locationPanel = (
        <div>
          <p align="justify">Street :&nbsp;{pa.street}</p>
          <p align="justify">City :&nbsp;{pa.city}</p>
          <p align="justify">State :&nbsp;{pa.state}</p>
          <p align="justify">Zip :&nbsp;{pa.zip}</p>
          <p align="justify">Country:&nbsp;{pa.country}</p>
        </div>
      )
    } else {
      locationPanel = (
        <div><p align="justify">Virtual - On line Society with no geocentric focused location</p></div>
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
          <div className="col-3 text-left">
            <b>Location:&nbsp;</b>
          </div>
          <div className="col-9">
            <p align="justify">{this.props.reviewObj.locationType}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-3 text-left">
            <b>Details:&nbsp;</b>
          </div>
          <div className="col-9 location_position">{locationPanel}</div>
        </div>
        <div className="spaces" />
        <hr />
        <div className="row">
          <div className="col">
            <div className="picture_review_card">
              {picPanel}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Review;

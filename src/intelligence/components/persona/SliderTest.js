import React, { Component } from "react";
import axios from "axios";
// import Slider from "react-rangeslider";
// import "react-rangeslider/lib/index.css";
import ReactLoading from "react-loading";

import "./SliderTest.css";

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const PERSONA_QUESTION_API_POST = "/routes/users/getUserPersonaQ";
// let lines = [];
let slider = [];

class SliderTest1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      isLoading: false
      // INITIAL_STATE
    };
  }

  async componentWillMount() {
    let data = await this.addToSlider(1000000017);
    // console.log("Data will: ", data);
  }

  addItem = value => {
    this.setState(state => {
      const list = [value, ...state.list];
      return { list };
    });
  };

  addToSlider = async baandaid => {
    let url =
      baandaServer + PERSONA_QUESTION_API_POST + "?baandaid=" + baandaid;
    try {
      // console.log("About to axios get ...");
      let value;
      let retdata = await axios.get(url);
      if (retdata.data) {
        let noOfRecs = retdata.data.length;
        for (var i = 0; i < noOfRecs; i++) {
          // console.log('in for -- ', i, '. ', retdata.data[i]);
          slider[i] = {
            seq_no: retdata.data[i].seq_no,
            q: retdata.data[i].question,
            v: retdata.data[i].score
          };
        //   if (i === 28) {
        //     console.log("Last slider rec :", i, ". ", slider[i]);
        //   }
          this.addItem(slider[i]);
          value = {
            seq_no: retdata.data[i].seq_no,
            q: retdata.data[i].question,
            v: retdata.data[i].score
          };
          this.addItem(value);
        }
        return retdata.data;
      } else {
        // console.log("No data received");
        throw new Error(
          "Did not receive questions from server. Please report to info@baanda.com"
        );
      }
    } catch (error) {
      console.log("Error: (from UserInitPersona) ", error);
      return false;
    }
  };

  openPersonaQAModal = () => {
    alert("Open modal for what is this?");
  };

  //   handleChange = e => {
  //     // console.log("e:", e.target.value, "  ", e.target.id, " ");
  //     this.setState({
  //       value: e.target.value
  //     });
  //   };

  handleChangeSlide = e => {
    let id = e.target.id;
    let val = e.target.value;
    console.log("handle3 e:", val, " --id: ", id);
    slider.map((rec, k) => {
      // console.log('rec:', rec, '  k:', k)
      if (parseInt(id) === k) {
        console.log("slide map: ", rec);
        slider[k] = {
          seq_no: rec.seq_no,
          q: rec.q,
          v: parseInt(val)
        };
      }
      return slider;
    });

    // slider.forEach(function(slide) {
    //   console.log("no:" + slide.seq_no);
    //   if (parseInt(slide.seq_no) === parseInt(id)) {
    //     console.log("slide forEach:", slide);
    //   }
    // });

    this.setState(state => {
      const list = state.list.map((item, k) => {
        if (parseInt(id) === k) {
          console.log('handleChangeSlide:', item, ' k:', k);  
          return parseInt(val);
        } else {
          return item;
        }
      });
      return { list };
    });
  };

  render() {
    // console.log("in render slider: ", slider[1]);
    // console.log("this.state:", this.state);
    let loading;
    if (this.state.isLoading) {
      loading = (
        <div className="row">
          <div className="col-5 text-right">Loading questions</div>
          <div className="col-2">
            <ReactLoading
              type={"spokes"}
              color={"#195670"}
              height={30}
              width={30}
            />
          </div>
          <div className="col-5 text-left">... please wait</div>
        </div>
      );
    }

    return (
      <div className="container text-center">
        <div className="row page-top">
          <div className="col-3">&nbsp;</div>
          <div className="col-6">
            <div className="qa_header">Personality, Geolocation & Contacts</div>
          </div>
          <div className="col-3">
            <button
              className="btn-modal"
              type="button"
              onClick={this.openPersonaQAModal}
            >
              <b>What is this?</b>
            </button>{" "}
            &nbsp;
          </div>
        </div>
        {loading}
        <div className="text-center">
          {/* {slider.map((item, i) => ( */}
          {this.state.list.map((item, i) => (
            <div key={i}>
              <div className="question-text">
                <font size="2">
                  {item.seq_no}.&nbsp;{item.q}{" "}
                </font>
              </div>
              <div className="slidecontainer">
                <input
                  id={item.seq_no}
                  type="range"
                  min="0"
                  max="10"
                  onChange={this.handleChangeSlide}
                  step="1"
                  value={item.v}
                  className="slider"
                />{" "}
                &nbsp;
                {item.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default SliderTest1;

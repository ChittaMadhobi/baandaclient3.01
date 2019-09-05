import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";

import "./PosFinish.css";

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const getMembersOfCommunity = "/routes/dashboard/getMembersOfCommunity?";

class PosFinish extends Component {
  constructor(props) {
    super(props);

    this.state = {
      decisionFlag: false,
      searchCustomerName: "",
      searchAndEditMsg: "",
      memberSelected: null,
      posCustomerNameErrFlag: false,
      memberSelectToEditFlag: false,
      searchAndEditErrorFlag: false,
      memberSelectedFlag: false,
      posCustomerNameMsg: "Part/full Customer name to filter.",
      confirmErrorMsg: "On Finish, invoice will be in your email.",

      membersRaw: [],
      filtered: [],
      members: []
    };
  }

  onChangeCustomerName = async e => {
    // console.log("name: ", [e.target.name], " value:", e.target.value);
    await this.setState({
      [e.target.name]: e.target.value
    });
    let letterNumber = /^[\w\-.\s]+$/;
    if (!this.state.searchCustomerName.match(letterNumber)) {
      if (this.state.searchCustomerName.length > 0) {
        await this.setState({
          posCustomerNameErrFlag: true,
          posCustomerNameMsg: "Only Alphanumeric, space, -, _ is allowed."
        });
      } else {
        await this.setState({
          posCustomerNameErrFlag: false,
          posCustomerNameMsg: "Part/full Customer name to filter."
        });
      }
    } else {
      await this.setState({
        posCustomerNameErrFlag: false,
        posCustomerNameMsg: "Part/full Customer name to filter."
      });
    }
  };

  handleFind = async () => {
    // #1 load membersRaw from DB
    await this.loadRawMemberData();
    // #2 Remmove duplicate member entries in raw
    await this.consolidateDuplicateMembersofRaw();
    // #3. sort the list
    let sortedMembers = this.state.filtered.sort(
      this.sortOn("memberName", "asc")
    );
    // #4. Filter the list based on partial name entered.
    console.log("Entered partial Member name: ", this.state.searchCustomerName);
    let selectedMembers = sortedMembers.filter(elm =>
      elm.memberName
        .toLowerCase()
        .includes(this.state.searchCustomerName.toLocaleLowerCase())
    );

    console.log("final member list:", selectedMembers);
    await this.setState({
      members: selectedMembers,
      memberSelectToEditFlag: true,
      memberSelectedFlag: false
    });
    // If there is no match ... show error (no Match found)

    // If there is one match ... proceed to completion of transaction

    // If there are more than many ... as user to select one from the choices.
  };

  // Load all members of all groups of the community in a state variable
  // named 'membersRaw' or this.state.membersRaw
  loadRawMemberData = async () => {
    let param = "communityId=" + this.props.communityid;
    // let param = "communityId=100002";
    let url = baandaServer + getMembersOfCommunity + param;
    console.log("url: ", url);

    try {
      let mem = await axios.get(url);
      let memData = mem.data.Msg;
      memData.forEach(async obj => {
        obj.members.forEach(async e => {
          await this.setState({
            membersRaw: [...this.state.membersRaw, e]
          });
        });
      });
    } catch (err) {
      console.log("loadRawMemberData Error:", err.message);
    }
  };

  // Since a member may belong to multiple groups in a community,
  // it rawMembers, they will appeal multiple time. We need to
  // consolidate that.
  consolidateDuplicateMembersofRaw = () => {
    this.state.membersRaw.forEach(async obj => {
      if (this.state.filtered.length > 0) {
        if (
          this.state.filtered.filter(e => e.email === obj.email).length === 0
        ) {
          await this.setState({
            filtered: [...this.state.filtered, obj]
          });
        }
      } else {
        await this.setState({
          filtered: [...this.state.filtered, obj]
        });
      }
    });
  };

  // Sort the filtered member alphebatically for easier use.
  sortOn = (property, AscDsc) => {
    if (AscDsc === "dsc") {
      return function(a, b) {
        if (a[property] > b[property]) {
          return -1;
        } else if (a[property] < b[property]) {
          return 1;
        } else {
          return 0;
        }
      };
    } else {
      return function(a, b) {
        if (a[property] < b[property]) {
          return -1;
        } else if (a[property] > b[property]) {
          return 1;
        } else {
          return 0;
        }
      };
    }
  };

  handleMemberSelected = async e => {
    let data = JSON.parse(e.target.value);
    console.log("value:", data, " target.name:", [e.target.name]);
    await this.setState({
      [e.target.name]: data,
      memberSelectedFlag: true,
      memberSelectToEditFlag: false
    });
  };

  handleReturnToPos = () => {};

  handleCompletePos = () => {};
  render() {
    console.log("props:", this.props);
    console.log("state:", this.state);
    let selheight = this.state.members.length;
    if (selheight > 7) selheight = 7;

    let memlist = this.state.members.map((obj, i) => {
      return (
        <option key={i} value={JSON.stringify(obj)}>
          {obj.memberName}
        </option>
      );
    });

    let selectMemberdropdown;
    if (this.state.memberSelectToEditFlag) {
      selectMemberdropdown = (
        <div>
          <div className="row select_panel_inventory">
            <div className="col text-center">
              <select
                size={selheight}
                name="memberSelected"
                onChange={this.handleMemberSelected}
                className="member-select"
              >
                {memlist}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col text-center select_item_msg">
              Please select an item to edit
            </div>
          </div>
        </div>
      );
    }
    if (this.state.searchAndEditErrorFlag) {
      selectMemberdropdown = (
        <div>
          <div className="row">
            <div className="col text-center select_member_msg_err">
              {this.state.searchAndEditMsg}
            </div>
          </div>
        </div>
      );
    }

    let searchInputPanel;
    searchInputPanel = (
      <div className="text-center">
        <div className="row customer_search">
          <div className="col-10 customer_search_input">
            <input
              name="searchCustomerName"
              type="text"
              value={this.state.searchCustomerName}
              onChange={this.onChangeCustomerName}
              size="50"
              maxLength="50"
              className="input_customer_name"
              placeholder="Customer or member name."
            />
            <div
              className={`${
                !this.state.posCustomerNameErrFlag
                  ? "pos_customer_input_msg"
                  : "pos_customer_input_msg_err"
              }`}
            >
              <p>{this.state.posCustomerNameMsg}</p>
            </div>
          </div>
          <div className="col-2 text-left">
            <button
              className="btn_goPosCustomerFind"
              type="button"
              onClick={this.handleFind}
            >
              <i className="fas fa-search" />
            </button>
          </div>
        </div>
        <div>{selectMemberdropdown}</div>
      </div>
    );

    let showMemberSelectedPanel;

    if (this.state.memberSelectedFlag) {
      showMemberSelectedPanel = (
        <div>
          <div className="text-center show_member_header">Member Selected</div>
          <div className="row">
            <div className="col-4 text-right label_format">
              Member Name:&nbsp;
            </div>
            <div className="col-4 text-left data_format">
              {this.state.memberSelected.memberName}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right label_format">Email:&nbsp;</div>
            <div className="col-4 text-left data_format">
              {this.state.memberSelected.email}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right label_format">Cell:&nbsp;</div>
            <div className="col-4 text-left data_format">
              {this.state.memberSelected.cell === ""
                ? "Not available"
                : this.state.memberSelected.cell}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right label_format">Type:&nbsp;</div>
            <div className="col-4 text-left data_format">
              {this.state.memberSelected.memberType === "individual"
                ? "Person"
                : "Community"}
            </div>
          </div>
          <div className="row">
            <div className="col-6 text-center confirm_format">
              <input
                type="checkbox"
                onChange={this.handleConfirm}
                name="confirm"
              />{" "}
              Confirm please
            </div>
            <div className="col-6 text-right">
              <button
                className="btn_retToPos"
                type="button"
                onClick={this.handleReturnToPos}
              >
                Return&nbsp;
                <i className="fas fa-undo" />
              </button>
              &nbsp;&nbsp;
              <button
                className="btn_completePos"
                type="button"
                onClick={this.handleCompletePos}
              >
                Finish&nbsp;
                <i className="far fa-check-circle" />
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col text-center confirm_err_format">
              {this.state.confirmErrorMsg}
            </div>
          </div>
        </div>
      );
    }

    let posFinishOutput;
    posFinishOutput = (
      <div>
        {searchInputPanel}
        {showMemberSelectedPanel}
      </div>
    );

    return <div>{posFinishOutput}</div>;
  }
}

PosFinish.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

// const mapDispatchToProps = dispatch => ({
//   hideModal: () => dispatch(hideModal()),
//   showModal: (modalProps, modalType) => {
//     // console.log(
//     //   "modalProps:" + JSON.stringify(modalProps) + "  |modalType:" + modalType
//     // );
//     dispatch(showModal({ modalProps, modalType }));
//   }
//   // setQAInitDone: () => dispatch(setQAInitDone(userData))
// });

export default connect(
  mapStateToProps
  // mapDispatchToProps
)(withRouter(PosFinish));

// export default PosFinish;

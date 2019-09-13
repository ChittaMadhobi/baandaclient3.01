import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import moment from 'moment';

import "./PosFinish.css";

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const getMembersOfCommunity = "/routes/dashboard/getMembersOfCommunity?";
const saveInvoice = "/routes/dashboard/saveInvoice";

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
      customerNote: "",
      saleCompleteFlag: false,

      membersRaw: [],
      filtered: [],
      members: [],
      picCaption: ""
    };
  }

  onChange = async e => {
    console.log("name: ", [e.target.name], " value:", e.target.value);
    await this.setState({ [e.target.name]: e.target.value });
    // console.log("itemPrice:", this.state.itemPrice);
  };

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
    // this.createPayDueDateMo('monthly');
    // this.createPayDueDateWe('weekly');

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
    if (selectedMembers.length === 0) {
      await this.setState({
        members: [],
        searchAndEditErrorFlag: true,
        memberSelectToEditFlag: false,
        memberSelectedFlag: false,
        searchAndEditMsg: "Error: No member found with that filter.",
        memberSelected: null
      });
    } else if (selectedMembers.length === 1) {
      // If there is one match ... proceed to completion of transaction
      await this.setState({
        members: selectedMembers,
        memberSelected: selectedMembers[0],
        searchAndEditErrorFlag: false,
        memberSelectToEditFlag: false,
        memberSelectedFlag: true,
        searchAndEditMsg: ""
      });
    } else {
      // If there are more than many ... as user to select one from the choices.
      await this.setState({
        members: selectedMembers,
        memberSelectToEditFlag: true,
        memberSelectedFlag: false,
        searchAndEditMsg: "",
        memberSelected: null
      });
    }
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

  handleReturnToPos = () => {
    // console.log("handleGoBack ..");
    this.props.returnToPos();
  };

  handleConfirm = async () => {
    await this.setState(prevstate => ({
      decisionFlag: !prevstate.decisionFlag,
      confirmErrorMsg: "On Finish, invoice will be in your email."
    }));
    console.log("this.state:", this.state);
  };

  handleCompletePos = async () => {
    // alert('Now to complete ... complex ... start with backend.')
    if (!this.state.decisionFlag) {
      await this.setState({
        confirmErrorMsg: "Error: Please confirm to complete."
      });
    } else {
      let inputData = this.packageDataForDB();
      let url = baandaServer + saveInvoice;

      console.log("################### inputData: ", inputData);
      console.log('url: ', url);
      try {
        // let ret = await axios.post(url, data);
        let msg = await axios.post(url, inputData);
        console.log('return msg:', msg);
        await this.setState({
          memberSelectedFlag: false,
          memberSelectToEditFlag: false,
          saleCompleteFlag: true
        });
      } catch (err) {
        console.log("PosFinish Error:", err.message);
      }
    }
  };

  createPayDueDateMo = (type) => {
    let today = moment();
    let month = today.month();
    let year = today.year();
    // let day = today.date();
    let day = this.props.posState.installmentDateOfMonth;
    let currMoDate = moment({ year: year, month: month, day:day});
    let payday;
    console.log('>>>>>>>>>>>>>>>>>>> type:', type);
    if ( this.props.posState.installmentType.value === 'monthly') {
      payday = currMoDate.add(1, 'month'); 
      // console.log('=============================================');
      // console.log( 'Current Month date:', currMoDate.format('ll') );
      // console.log( 'Next month paydate:', payday.format('ll'));  
      // console.log('============================================='); 
    } else {
      payday = currMoDate.add(2, 'month');
      // console.log('=============================================');
      // console.log( 'Current Month date:', currMoDate.format('ll') );
      // console.log( 'Next month paydate:', currMoDate.add(2, 'month').format('ll'));  
      // console.log('=============================================');  
    }

    return payday;
  }

  createPayDueDateWe = (type) => {
    let today = moment();
    let dow = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    let todaydow = today.format('ddd');
    let tardatdow = this.props.posState.installmentDayOfWeek.value;
    console.log('*******************');
    console.log('tardatdow:', tardatdow, ' type:', type);
    let i=0, j=0, k=0;
    dow.forEach(elm => {
      // console.log(i, '. elm:', elm);
      if ( elm === todaydow) {
        j = i
      }
      if ( elm === tardatdow) {
        k = i;
      }
      i++;
    });
    let diff;
    if ( j <= k ) {
      diff = (k-j) ;
    } else {
      diff = (6 - k) ;
    }

    let payday;
    console.log('***** todaydow:', todaydow, ' j=',j , ' k=', k); 
    // if ( type === "weekly") {
      if ( this.props.posState.installmentType.value === "weekly") {
      payday = today.add( diff+7, 'day');
    } else  {
      payday = today.add( diff+14, 'day');
    } 
    console.log('------------->>>> diff:', diff);
    console.log('Weekly next payday:', payday.format('ll'));
    console.log('*******************');
    return payday;
  }

  packageDataForDB = () => {
    let instType = "";
    let payByDoM = "";
    let payByDoW = "";
    let paidamt = 0;
    let nextpayday = moment();
    if (this.props.posState.paySchedule.value === "installment") {
      instType = this.props.posState.installmentType.value;
      if (
        this.props.posState.installmentType.value === "monthly" ||
        this.props.posState.installmentType.value === "bi-monthly"
      ) {
        payByDoM = this.props.posState.installmentDateOfMonth;
        nextpayday = this.createPayDueDateMo(this.props.posState.installmentDateOfMonth);
      } else {
        payByDoW = this.props.posState.installmentDayOfWeek.value;
        nextpayday = this.createPayDueDateWe(this.props.posState.installmentDayOfWeek.value)
      }
    }

    let lastpaymentday = null;
    if (this.props.posState.paySchedule.value === "fullpay") {
      paidamt = this.props.posState.toPayTotal;
      lastpaymentday = moment();
    } else {
      paidamt = this.props.posState.amountPaid;
    }
    

    if (this.props.posState.paySchedule.value === "partpay") {
      // console.log('Inside partpay this.props.posState.payByDate:', this.props.posState.payByDate.format('lll'));
      nextpayday = this.props.posState.payByDate;
      lastpaymentday = moment();
    }  

    console.log('nextpayday: ', nextpayday.format('MM-DD-YYYY'));

    let itemsArray = [];
    let itemObj = {};
    this.props.posState.itemsInCart.forEach(obj => {
      itemObj = {
        itemId: obj.itemId,
        itemName: obj.itemName,
        itemUnit: "number",
        unitName: "each",
        price: obj.itemPrice,
        quantity: parseInt(obj.itemQty, 10),
        cost: parseFloat((obj.itemPrice * parseInt(obj.itemQty, 10)).toFixed(2))
      };
      itemsArray.push(itemObj);
    });

    let exportData = {
      invoiceOfBaandaId: this.state.memberSelected.baandaId,
      invoiceOfEmail: this.state.memberSelected.email,
      customerName: this.state.memberSelected.memberName,
      communityId: this.props.communityid,
      paySchedule: this.props.posState.paySchedule,
      paySchedulePolicy: {
        installmentType: instType,
        payByDateOfMonth: payByDoM,
        payByDayOfWeek: payByDoW,
        nextSchedulePayDay: nextpayday.format('MM-DD-YYYY')
      },
      finBreakdown: {
        totalInvoiceAmount: this.props.posState.toPayTotal,
        amountPaid: paidamt,
        lastPaymentDate: lastpaymentday,
        discountAmount: this.props.posState.toPayDiscount,
        taxAmount: this.props.posState.toPayTax,
        baandaServiceFee: this.props.posState.toPayProcessingFee
      },
      itemDetails: itemsArray,
      invoiceNote: this.state.customerNote,
      updatedBy: this.props.auth.user.baandaId
    };
    
    console.log('&&&&&&&&&&  ExportData:', exportData);

    return exportData;
  };

  handleExit = () => {
    // alert('figure out where to go ... ');
    this.props.saleCompleteExit();
  }

  render() {
    console.log("posfinish props:", this.props);
    console.log("posfinish state:", this.state);
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
            <div className="col-8 text-left data_format">
              {this.state.memberSelected.memberName}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right label_format">Email:&nbsp;</div>
            <div className="col-8 text-left data_format">
              {this.state.memberSelected.email}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right label_format">Cell:&nbsp;</div>
            <div className="col-8 text-left data_format">
              {this.state.memberSelected.cell === ""
                ? "Not available"
                : this.state.memberSelected.cell}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right label_format">Type:&nbsp;</div>
            <div className="col-8 text-left data_format">
              {this.state.memberSelected.memberType === "individual"
                ? "Person"
                : "Community"}
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right label_format">Note:&nbsp;</div>
            <div className="col-8 text-left data-format">
              <textarea
                name="customerNote"
                maxLength="500"
                placeholder="Notes on invoice - optional (less than 500 chars)."
                rows="3"
                wrap="hard"
                spellCheck="true"
                className="input_invoice_note"
                onChange={this.onChange}
                value={this.state.customerNote}
                required
              />
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
                Go back&nbsp;
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

    let finishPanel;
    if (this.state.saleCompleteFlag) {
      finishPanel = (
        <div>
          <div className="final_message text-center">
            Thank you for your business.
          </div>
          <div className="text-center">
            <button
              className="btn_completePos"
              type="button"
              onClick={this.handleExit}
            >
              Exit&nbsp;
              <i className="far fa-check-circle" />
            </button>
          </div>
        </div>
      );
    }

    let posFinishOutput;
    if (this.state.saleCompleteFlag) {
      posFinishOutput = <div>{finishPanel}</div>;
    } else {
      posFinishOutput = (
        <div>
          {searchInputPanel}
          {showMemberSelectedPanel}
        </div>
      );
    }

    return (
    // <div className="fixedsize_pos_finish">
    <div>
    {posFinishOutput}
    <div className="pos_finish_spacing" />
    </div>);
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

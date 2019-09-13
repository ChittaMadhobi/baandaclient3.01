import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
// import _ from "lodash";
import Select from "react-select";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

import "./Pos.css";

import { optionsPaySchedule } from "./data/paySchedule";
import { optionsCurrencyType } from "./data/currencyType";
import { optionsPayMedium } from "./data/payMedium";
import { optionsInstallmentType } from "./data/installmentType";
import { optionsWeekOfDay } from "./data/dayOfWeek";

import PosReview from "./pos/PosReview";
import PosFinish from "./pos/PosFinish";

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const serchItemToEdit = "/routes/dashboard/searchItemToEdit?";
const getCommunityInfo = "/routes/dashboard/getCommunityInfo?";

let options = [];
let itemsInCartArray = [];

const customStyles = {
  control: base => {
    // console.log("customStyles: ", base);
    return {
      ...base,
      height: 30,
      minHeight: 30,
      maxHeight: 130
    };
  }
};

class Pos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItemName: "",
      selectedItemId: 0,
      selectedItemPrice: 0.0,
      selectedItemInventory: 0,
      itemQty: "",
      calculatedItemCost: 0.0,
      costQtyErrFlag: false,
      joiningProcess: "",

      itemSearchDropdownFlag: false, // Dropdown based on entries in item input panel

      searchItemName: "",
      posItemNameErrFlag: false,
      posItemNameMsg: "Part/full item name to filter.",

      itemSelectToBuyFlag: false,
      searchAndEditMsg: "Please scroll & select an item.",
      item: [], // This will contain list of items selected,
      itemsInCart: [],
      searchAndEditErrorFlag: false,
      itemToBuyFlag: false,
      showTheCartFlag: false,
      checkoutFlag: false,

      totalcost: 0.0,
      discount: 0.0,
      tax: 0.0,
      processingFee: 0.25,
      toPayTotal: 0.0,
      amountPending: 0.0,

      paySchedule: { value: "fullpay", label: "Pay in full now" },
      paidCheck: false,
      paymentProcessMsg: "",
      paymentDoneFlag: false,
      currencyType: {
        value: "dollar",
        label: "Dollar $"
      },
      payMedium: {
        value: "cash",
        label: "Cash $"
      },
      amountPaid: 0.0,
      // payByDate: new Date(),
      payByDate: moment(),
      toPayTax: 0.0,
      toPayDiscount: 0.0,
      toPayProcessingFee: 0.0,

      installmentType: {
        value: "monthly",
        label: "Monthly"
      },
      noOfInstallment: 0,
      amountPerIstallment: 0.0,
      installmentDateOfMonth: 15,
      installmentDayOfWeek: {
        value: "Fri",
        label: "Friday"
      },

      reviewFlag: false,
      customerHandlingFlag: false,
      buyItemErrFlag: false
    };
  }

  async componentWillUnmount() {
    // console.log("I am in component will mount");
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
    this.props.history.goForward();

    // while( this.state.itemsInCart.length > 0){
    //   this.state.itemsInCart.pop();
    // }
  }

  componentDidMount = async () => {
    // call to get the joiningProcess from communities using communityId
    // call getPosInitData()
    await this.getPosInitData();

    while (this.state.itemsInCart.length > 0) {
      this.state.itemsInCart.pop();
    }

    while (this.state.item.length > 0) {
      this.state.item.pop();
    }
  };

  getPosInitData = async () => {
    // console.log("I am into getPosInitData");
    let parms = "communityId=" + this.props.communityid;
    let url = baandaServer + getCommunityInfo + parms;
    try {
      let retData = await axios.get(url);
      // console.log("getPosInitData retData: ", retData);
      await this.setState({
        joiningProcess: retData.data.joiningProcess
      });
    } catch (err) {
      console.log("getPosInitData Error: " + err.message);
    }
  };

  onChange = async e => {
    let name = [e.target.name][0];
    console.log("name:", name);
    await this.setState({ [e.target.name]: e.target.value });
    if (name === "discount" || name === "tax" || name === "processingFee") {
      let total = parseFloat((this.state.totalcost * 1).toFixed(2));
      let totDiscount = parseFloat(
        (total * (this.state.discount / 100)).toFixed(2)
      );
      let totPostDiscount = parseFloat((total - totDiscount).toFixed(2));
      let totTax = parseFloat(
        (totPostDiscount * (this.state.tax / 100)).toFixed(2)
      );
      let totProcessing = totPostDiscount * (this.state.processingFee / 100);

      let totPending = parseFloat(
        (totPostDiscount + totTax - this.state.amountPaid).toFixed(2)
      );

      let amtPerInstallment = 0;
      if (this.state.noOfInstallment === 0) {
        amtPerInstallment = 0;
      } else {
        amtPerInstallment = parseFloat(
          (totPending / this.state.noOfInstallment).toFixed(2)
        );
      }
      // let toPay = totPostDiscount + totTax + totProcessing;
      let toPay = parseFloat((totPostDiscount * 1 + totTax * 1).toFixed(2));
      let showPaySchedule;
      if (this.state.payProcessHandlingFlag) {
        showPaySchedule = true;
      } else {
        showPaySchedule = false;
      }
      console.log("onChange this.state.discount:", this.state.discount);
      console.log(
        "onChange [" +
          name +
          "] total=" +
          total +
          " totDiscount=" +
          totDiscount +
          " amout post discount:" +
          totPostDiscount +
          " totTax=" +
          totTax +
          " totProcessing=" +
          totProcessing +
          " toPay=" +
          toPay +
          " this.state.amountPaid:" +
          this.state.amountPaid +
          " totPending=" +
          totPending
      );

      await this.setState({
        toPayTotal: toPay,
        payProcessHandlingFlag: showPaySchedule,
        toPayTax: totTax,
        toPayDiscount: totDiscount,
        toPayProcessingFee: totProcessing,
        amountPending: totPending,
        amountPerIstallment: amtPerInstallment
      });
    }
  };

  onChangeAmtPaid = async e => {
    // console.log("name: ", [e.target.name], " value:", e.target.value);
    // console.log("toPayTotal:", this.state.toPayTotal);
    let name = [e.target.name][0];

    let val = 0.0;
    if (e.target.value !== "") {
      val = parseFloat(e.target.value);
    }
    console.log(
      "onChangeAmtPaid [e.target.name]:",
      name,
      " value:",
      e.target.value,
      " this.state.toPayTotal:",
      this.state.toPayTotal,
      " val=",
      val
    );
    await this.setState({
      [e.target.name]: val,
      amountPending: this.state.toPayTotal - val
    });
  };

  onChangeUpfrontAmtPaid = async e => {
    let name = [e.target.name][0];
    let paidAmt = e.target.value;
    let paidAmtType = typeof paidAmt;
    let localPaidAmt = 0.0;
    if (paidAmtType === "string") {
      if (paidAmt === "") {
        localPaidAmt = 0.0;
      } else {
        localPaidAmt = parseFloat(paidAmt);
      }
    } else {
      localPaidAmt = paidAmt;
    }
    console.log(
      "e.targer.name:",
      name,
      " paidAmt:",
      paidAmt,
      "typeOf paidAmt:",
      typeof paidAmt,
      " localpaidamt:",
      localPaidAmt
    );
    let amtToPay = this.state.toPayTotal - paidAmt;
    let perInsAmt;

    if (amtToPay > 0) {
      if (this.state.noOfInstallment > 0) {
        perInsAmt = parseFloat(
          (amtToPay / this.state.noOfInstallment).toFixed(2)
        );
      } else {
        perInsAmt = parseFloat(amtToPay.toFixed(2));
      }
    } else {
      perInsAmt = 0;
    }
    console.log("name:", name, " paidAmt:", paidAmt, " amtToPay:", amtToPay);
    await this.setState({
      [e.target.name]: localPaidAmt,
      amountPending: this.state.toPayTotal - e.target.value,
      amountPerIstallment: perInsAmt
    });
  };

  onChangeNoOfInstallment = async e => {
    let paidAmt;
    // if ( this.state.amountPaid === 0){
    paidAmt = this.state.amountPaid;
    // } else {
    //   paidAmt = parseFloat(this.state.amountPaid.toFixed(2));
    // }
    let totAmount = parseFloat(this.state.toPayTotal.toFixed(2));
    let noOfIns = 0;
    if (e.target.value >= 0) {
      noOfIns = e.target.value;
    } else {
      noOfIns = 0;
    }

    let toPayInIns;
    if (noOfIns > 0) {
      toPayInIns = parseFloat(
        ((totAmount - paidAmt) / parseInt(noOfIns)).toFixed(2)
      );
    } else {
      toPayInIns = totAmount - paidAmt;
    }
    console.log(
      "paidAmt=",
      paidAmt,
      " totAmt=",
      totAmount,
      " noOfIns=",
      noOfIns,
      " toPayInIns=",
      toPayInIns
    );
    await this.setState({
      [e.target.name]: e.target.value,
      amountPerIstallment: toPayInIns
    });
  };

  handlePayByDate = async date => {
    console.log("handlePAyByDate :", date);
    await this.setState({
      payByDate: date
    });

    let main = this.state.payByDate;
    console.log("handlePayByDate >>>>>> Date:", main.format("L"));
  };

  onChangeItemName = async e => {
    // console.log("name: ", [e.target.name], " value:", e.target.value);
    await this.setState({
      [e.target.name]: e.target.value
    });
    let letterNumber = /^[\w\-.\s]+$/;
    if (!this.state.searchItemName.match(letterNumber)) {
      if (this.state.searchItemName.length > 0) {
        await this.setState({
          posItemNameErrFlag: true,
          posItemNameMsg: "Only Alphanumeric, space, -, _ is allowed."
        });
      } else {
        await this.setState({
          posItemNameErrFlag: false,
          posItemNameMsg: "Part/full item name to filter."
        });
      }
    } else {
      await this.setState({
        posItemNameErrFlag: false,
        posItemNameMsg: "Part/full item name to filter."
      });
    }
  };

  handleFind = async () => {
    await this.setState({
      itemToBuyFlag: false,
      searchAndEditMsg: "",
      searchAndEditErrorFlag: false
    });
    let ifExists = true;
    let params =
      "communityId=" +
      this.props.communityid +
      "&itemName=" +
      this.state.searchItemName;
    let url = baandaServer + serchItemToEdit + params;
    // console.log("if exists get url:", url);
    try {
      let ret = await axios.get(url);
      if (ret.data.status === "Error") {
        // console.log("msg:", ret.data.Msg);
        throw new Error(`No items found with this entry.`);
      } else {
        // console.log("ret msg:", ret.data.Msg);
        if (ret.data.Msg.length === 0) {
          // console.log(">>>>>>>>>>> Length of 0");
          await this.setState({
            itemSelectToBuyFlag: false,
            searchAndEditMsg:
              "No item found with your entry. Try again please.",
            searchAndEditErrorFlag: true
          });
        } else if (ret.data.Msg.length === 1) {
          // display the item for edit
          // console.log(">>>>>> item Id:", ret.data.Msg[0].itemId);
          let ifExist = false;
          this.state.itemsInCart.forEach(elm => {
            if (elm.itemId === ret.data.Msg[0].itemId) {
              ifExist = true;
            }
          });
          if (!ifExist) {
            this.prepForSell(ret.data.Msg[0]);
          } else {
            await this.setState({
              itemSelectToBuyFlag: false,
              searchAndEditMsg: "The item's in the cart. Delete & buy again.",
              searchAndEditErrorFlag: true
            });
          }
        } else {
          let option = {};
          options = [];
          let infoMsg = false;
          ret.data.Msg.forEach(async obj => {
            option = {
              value: obj.itemId,
              label: obj
            };
            // console.log("itemsInCart:", this.state.itemsInCart);
            let ifExist = false;
            this.state.itemsInCart.forEach(elm => {
              if (elm.itemId === obj.itemId) {
                ifExist = true;
              }
            });
            if (!ifExist) {
              options.push(option);
            } else {
              infoMsg = true;
            }
            // console.log("obj:", obj, " itemId:", obj.itemId);
          });
          console.log("option", options);
          if (infoMsg) {
            console.log('options.length: ', options.length);
            console.log('options: ', options);
            if (options.length === 1) {
              await this.setState({
                itemSelectToBuyFlag: false,
                itemToBuyFlag: true,
                selectedItemName: options[0].label.itemName,
                selectedItemId: options[0].label.itemId,
                selectedItemPrice: options[0].label.itemPrice,
                calculatedItemCost: 0.0,
                itemQty: "",
                selectedItemInventory: options[0].label.currentInventory,
                costPanelMessage: "Enter quantity please.",
                showTheCartFlag: true
              });
              
              console.log('@@@ this.state:', this.state);
              this.prepForSell(options);
            } else {
              await this.setState({
                itemSelectToBuyFlag: true,
                item: options,
                searchAndEditMsg:
                  "To change items in cart, delete & buy again.",
                searchAndEditErrorFlag: true
              });
            }
          } else {
            await this.setState({
              itemSelectToBuyFlag: true,
              searchAndEditMsg: "Please scroll & select an item.",
              item: options,
              searchAndEditErrorFlag: false
            });
          }
        }
      }
    } catch (err) {
      console.log("err:", err.message);
      ifExists = false;
    }

    return ifExists;
  };

  handleItemSelected = async e => {
    let data = JSON.parse(e.target.value);
    // console.log('handleItemSelected data:', data);
    await this.setState({
      itemSelectToBuyFlag: false,
      itemToBuyFlag: true,
      selectedItemName: data.itemName,
      selectedItemId: data.itemId,
      selectedItemPrice: data.itemPrice,
      calculatedItemCost: 0.0,
      itemQty: "",
      selectedItemInventory: data.currentInventory,
      costPanelMessage: "Enter quantity please.",
      showTheCartFlag: true
    });
    // console.log("data:", data);
    // alert('here in handleItemSelected');
  };

  qtyOnChange = async e => {
    await this.setState({
      [e.target.name]: e.target.value,
      calculatedItemCost: e.target.value * this.state.selectedItemPrice,
      costQtyErrFlag: false
    });
  };

  handleClearCostPanel = async () => {
    // alert('On handleClearCostPanel');
    await this.setState({
      itemSelectToBuyFlag: false,
      selectedItemName: "",
      selectedItemId: 0,
      selectedItemPrice: 0,
      selectedItemInventory: 0,
      calculatedItemCost: 0.0,
      itemQty: "",
      costPanelMessage: "",
      itemToBuyFlag: false,
      payProcessHandlingFlag: false
    });
  };

  handleAddCostPanel = async () => {
    // alert("On handleAddCostPanel");
    if (this.state.itemQty && this.state.itemQty >= 0) {
      if (this.state.selectedItemInventory - this.state.itemQty >= 0) {
        let sizedItemName;
        if (this.state.selectedItemName.length > 25) {
          sizedItemName = this.state.selectedItemName.substring(0, 24);
        } else {
          sizedItemName = this.state.selectedItemName;
        }
        // itemsInCart
        let data = {
          itemId: this.state.selectedItemId,
          itemName: sizedItemName,
          itemPrice: this.state.selectedItemPrice,
          itemQty: this.state.itemQty
        };

        itemsInCartArray.push(data);
        // Initialize cost Panel
        await this.setState({
          itemSelectToBuyFlag: false,
          costQtyErrFlag: false,
          selectedItemName: "",
          selectedItemId: 0,
          selectedItemPrice: 0,
          selectedItemInventory: 0,
          calculatedItemCost: 0.0,
          itemQty: "",
          costPanelMessage: "",
          itemsInCart: itemsInCartArray,
          itemToBuyFlag: false,
          buyItemErrFlag: false
        });
      } else {
        await this.setState({
          buyItemErrFlag: true,
          costQtyErrFlag: false
        });
      }
    } else {
      await this.setState({
        costQtyErrFlag: true,
        buyItemErrFlag: false
      });
    }

    // console.log("itemsInCartArray:", itemsInCartArray);
  };

  // subtractInventoryFromItem = async (data) => {

  //   let localItem = this.state.item;
  //   console.log('localItem item:', localItem);
  //   console.log('input data:',  data);
  //   let i=0, j;
  //   let qty;
  //   localItem.forEach(obj => {
  //     console.log('obj.label.itemId:',obj.label.itemId, ' data.itemId:', data.itemId);
  //     if (obj.label.itemId === data.itemId ){
  //       j = i;
  //       console.log('B i:',j, ' localItem[i].currentInventory:',localItem[j].currentInventory)
  //       qty = obj.label.currentInventory;
  //       localItem[i].label.currentInventory = (qty - parseInt(data.itemQty));
  //       console.log('A i:',i, ' localItem[i].currentInventory:',localItem[i].currentInventory)
  //     }
  //     i++;
  //   });
  //   await this.setState({
  //     item: localItem
  //   });
  //   console.log('>>> item: ', this.state.item);
  // }

  handleDeleteMember = async item => {
    // let itemObj = JSON.parse(item);
    console.log("to be deleted item:", item);
    let index = itemsInCartArray.findIndex(x => x.itemId === item.itemId);
    console.log("handleDeleteMember index:", index);

    itemsInCartArray.splice(index, 1);
    await this.setState({
      itemsInCart: itemsInCartArray,
      searchAndEditErrorFlag: false,
      searchAndEditMsg: "",
      itemSelectToBuyFlag: false
    });
  };

  prepForSell = async data => {
    console.log("prepForSell data:", data);
    await this.setState({
      itemSelectToBuyFlag: false,
      itemToBuyFlag: true,
      selectedItemName: data.itemName,
      selectedItemId: data.itemId,
      selectedItemPrice: data.itemPrice,
      calculatedItemCost: 0.0,
      itemQty: "",
      selectedItemInventory: data.currentInventory,
      costPanelMessage: "Enter quantity please.",
      showTheCartFlag: true
    });
  };

  handlecheckout = async () => {
    let total = 0.0;
    this.state.itemsInCart.forEach(obj => {
      total = parseFloat((total + obj.itemPrice * obj.itemQty).toFixed(2));
    });
    // console.log("handlecheckout itemsincart:", this.state.itemsInCart);
    console.log("handlecheckout Total : ", total);
    await this.setState({
      checkoutFlag: true,
      itemSelectToBuyFlag: false,
      totalcost: total,
      payProcessHandlingFlag: false,
      paymentDoneFlag: false
    });
  };

  handleBuy = async () => {
    // alert('handle buy');
    await this.setState({
      checkoutFlag: false,
      itemSelectToBuyFlag: false,
      payProcessHandlingFlag: false
      // showTheCartFlag: true
    });
  };

  handlePay = async () => {
    // alert("handle pay");
    let total = 0.0;
    this.state.itemsInCart.forEach(obj => {
      total = total + parseFloat((obj.itemPrice * obj.itemQty).toFixed(2));
    });
    let totDiscount = parseFloat(
      (total * (this.state.discount / 100)).toFixed(2)
    );
    let totPostDiscount = parseFloat((total - totDiscount).toFixed(2));
    let totTax = parseFloat(
      (totPostDiscount * (this.state.tax / 100)).toFixed(2)
    );
    let totProcessing = totPostDiscount * (this.state.processingFee / 100);
    // let toPay = totPostDiscount + totTax + totProcessing;
    let toPay = parseFloat((totPostDiscount + totTax).toFixed(2));
    console.log("handlePay toPay:", toPay.toFixed(2));
    console.log(
      "handlePay total=" +
        total +
        " totDiscount=" +
        totDiscount +
        " amout post discount:" +
        totPostDiscount +
        " totTax=" +
        totTax +
        " totProcessing=" +
        totProcessing +
        " toPay=" +
        toPay
    );
    await this.setState({
      toPayTotal: toPay,
      payProcessHandlingFlag: true,
      toPayTax: totTax,
      toPayDiscount: totDiscount,
      toPayProcessingFee: totProcessing,
      amountPending: toPay
    });
  };

  handlePaySchedule = async (selectedOption, { action }) => {
    console.log(
      "handlePaySchedule:",
      selectedOption,
      " value:",
      selectedOption.value
    );
    if (selectedOption.value === "fullpay") {
      console.log("Inside fullpay >>>>>>>>>>>>>>>>");
      await this.setState({
        paySchedule: selectedOption,
        amountPaid: 0,
        amountPending: this.state.toPayTotal
        // amountPerIstallment: 0,
        // noOfInstallment: 0
      });
    } else {
      await this.setState({
        paySchedule: selectedOption
      });
    }
  };

  handleDayOfWeek = async (selectedOption, { action }) => {
    await this.setState({
      installmentDayOfWeek: selectedOption
    });
  };

  handleCheckPaid = async () => {
    // alert("handle check paid");
    await this.setState({
      paidCheck: !this.state.paidCheck
    });
  };

  handleReview = async () => {
    // Checked and hence go for review
    let paydateofmonth = this.state.installmentDateOfMonth;
    if (
      this.state.paySchedule.value === "monthly" ||
      this.state.paySchedule.value === "bi-monthly"
    ) {
      if (
        this.state.installmentDateOfMonth > 28 ||
        this.state.installmentDateOfMonth < 1
      ) {
        paydateofmonth = 15;
      }
    }
    await this.setState({
      reviewFlag: true,
      payProcessHandlingFlag: false,
      showTheCartFlag: false,
      checkoutFlag: false,
      installmentDateOfMonth: paydateofmonth
    });
  };

  handleCurrencyType = async (selectedOption, { action }) => {
    // Uncomment when other options are used as well as remove defaults from options files
    // await this.setState({
    //   currencyType: selectedOption
    // });
  };

  handlePayMedium = async (selectedOption, { action }) => {
    // Uncomment when other options are used as well as remove defaults from options files
    // await this.setState({
    //   payMedium: selectedOption
    // });
  };

  handleInstallmentType = async (selectedOption, { action }) => {
    // console.log("installmentType:", this.state.installmentType);
    await this.setState({
      installmentType: selectedOption
    });
  };

  handleReturnToPos = async () => {
    // alert('returned to pos ... handleReturnToPos');
    console.log("Pos.js This is where ... review is returning to POS");
    await this.setState({
      reviewFlag: false,
      payProcessHandlingFlag: true,
      showTheCartFlag: true,
      checkoutFlag: true,
      customerHandlingFlag: false
    });
  };

  handleCustomerCheckout = async () => {
    // console.log("Pos.js Here we need to handle customer checkout.");
    await this.setState({
      reviewFlag: false,
      payProcessHandlingFlag: false,
      showTheCartFlag: false,
      checkoutFlag: false,
      customerHandlingFlag: true
    });
  };

  handleSaleComplete = async () => {
    // alert('Sale is complete and I am at pos. Get ready for the next sale.')

    while (this.state.itemsInCart.length > 0) {
      this.state.itemsInCart.pop();
    }
    while (this.state.item.length > 0) {
      this.state.item.pop();
    }

    await this.setState({
      selectedItemName: "",
      selectedItemId: 0,
      selectedItemPrice: 0.0,
      selectedItemInventory: 0,
      itemQty: "",
      calculatedItemCost: 0.0,
      costQtyErrFlag: false,
      joiningProcess: "",

      itemSearchDropdownFlag: false,

      searchItemName: "",
      posItemNameErrFlag: false,
      posItemNameMsg: "Part/full item name to filter.",

      itemSelectToBuyFlag: false,
      searchAndEditMsg: "Please scroll & select an item.",
      item: [],
      // itemsInCart: this.state.itemsInCart.splice(0, this.state.itemsInCart.length),
      searchAndEditErrorFlag: false,
      itemToBuyFlag: false,
      showTheCartFlag: false,
      checkoutFlag: false,

      totalcost: 0.0,
      discount: 0.0,
      tax: 0.0,
      processingFee: 0.25,
      toPayTotal: 0.0,
      amountPending: 0.0,

      paySchedule: { value: "fullpay", label: "Pay in full now" },
      paidCheck: false,
      paymentProcessMsg: "",
      paymentDoneFlag: false,
      amountPaid: 0.0,
      // payByDate: new Date(),
      payByDate: moment(),
      toPayTax: 0.0,
      toPayDiscount: 0.0,
      toPayProcessingFee: 0.0,

      installmentType: {
        value: "monthly",
        label: "Monthly"
      },
      noOfInstallment: 0,
      amountPerIstallment: 0.0,
      installmentDateOfMonth: 15,
      installmentDayOfWeek: {
        value: "friday",
        label: "Friday"
      },

      reviewFlag: false,
      customerHandlingFlag: false
    });
  };

  render() {
    // console.log("Pos.js props:", this.props);
    console.log("Pos.js state:", this.state);

    // This section is for item search drop down
    // **************************************************
    let selheight = this.state.item.length;
    if (selheight > 7) selheight = 7;

    let sellist = this.state.item.map((obj, i) => {
      return (
        <option key={i} value={JSON.stringify(obj.label)}>
          {obj.label.itemName}&nbsp;({obj.label.currentInventory} Qty)
        </option>
      );
    });

    let installmentSpec;
    if (
      this.state.installmentType.value === "bi-monthly" ||
      this.state.installmentType.value === "monthly"
    ) {
      installmentSpec = (
        <div>
          <div className="row">
            <div className="col-6 float-right installment_spec">
              Pay dateOfMonth:
            </div>
            <div>
              <input
                name="installmentDateOfMonth"
                type="number"
                min="1"
                // max="100.00"
                className="installment_date_of_month"
                onChange={this.onChange}
                value={this.state.installmentDateOfMonth}
                placeholder="A day between 1 to 28"
                step="1"
              />
            </div>
          </div>
          <div className="date_of_month">
            DateOfMonth will be 15 if not within 1 to 28.
          </div>
        </div>
      );
    } else if (
      this.state.installmentType.value === "bi-weekly" ||
      this.state.installmentType.value === "weekly"
    ) {
      installmentSpec = (
        <div>
          <div className="row">
            <div className="col-6 pick_day_of_week">Pay dayOfWeek:</div>
            <div className="col-6 install_select float-left">
              <Select
                value={this.state.installmentDayOfWeek}
                options={optionsWeekOfDay}
                className="pay_dayofweek_select"
                defaultValue={{
                  value: "friday",
                  label: "Friday"
                }}
                onChange={this.handleDayOfWeek}
                multi={false}
                styles={customStyles}
              />
            </div>
          </div>
        </div>
      );
    }

    let selectItemdropdown;
    // console.log('this.state.itemSelectToBuyFlag: ',this.state.itemSelectToBuyFlag);
    if (this.state.itemSelectToBuyFlag) {
      selectItemdropdown = (
        <div>
          <div className="row">
            <div className="col text-center div_pos_item_select">
              <select
                size={selheight}
                onChange={this.handleItemSelected}
                className="pos_item_select"
              >
                {sellist}
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
    // **************************************
    // Handles pay-schedule (now-full, part-IOU, installment)
    let payPanel1;
    payPanel1 = (
      <div>
        <div className="row">
          <div className="col-4 text-right pay_schedule_label">Schedule:</div>
          <div className="col-8 text-center paypanel1">
            <Select
              value={this.state.paySchedule}
              options={optionsPaySchedule}
              className="pay_schedule_select"
              defaultValue={{ value: "fullpay", label: "Pay in full" }}
              onChange={this.handlePaySchedule}
              multi={false}
              styles={customStyles}
            />
          </div>
        </div>
        <hr className="adjust_pos" />
      </div>
    );

    let payFinalPanel;
    payFinalPanel = (
      <div>
        <div className="row">
          <div className="col-4 text-right paid_in_full_check">&nbsp;</div>
          <div className="col-8 text-right review_btn_placement">
            {!this.state.paymentDoneFlag ? (
              <button
                className="btn_paid"
                type="button"
                onClick={this.handleReview}
              >
                Review&nbsp;
                <i className="fas fa-hands-helping" />
              </button>
            ) : null}
          </div>
        </div>
        <div className="row">
          <div
            className={`${
              !this.state.paymentErrFlag
                ? "col payment_processing_msg text-center"
                : "col payment_processing_msg_err text-center"
            }`}
          >
            <p>{this.state.paymentProcessMsg}</p>
          </div>
        </div>
      </div>
    );

    // This handles pay in full
    let payPanel2;
    payPanel2 = (
      <div>
        <div className="row">
          <div className="col-6 currency_type">
            <Select
              value={this.state.currencyType}
              options={optionsCurrencyType}
              className="currency_type_select"
              defaultValue={{
                value: "dollar",
                label: "Dollar $"
              }}
              onChange={this.handleCurrencyType}
              multi={false}
              styles={customStyles}
            />
          </div>
          <div className="col-6 pay_medium_type">
            <Select
              value={this.state.payMedium}
              options={optionsPayMedium}
              className="pay_medium_select"
              defaultValue={{
                value: "cash",
                label: "Cash $"
              }}
              onChange={this.handlePayMedium}
              multi={false}
              styles={customStyles}
            />
          </div>
        </div>
        <div className="test-center payPanel2_msg">
          Other options are disabled now.
        </div>
        {/* <div className="paypanel_spacing" /> */}
        <div className="paypanel_spacing" />
        {payFinalPanel}
      </div>
    );

    // This handles part pay + IOU
    let payPanelA;
    payPanelA = (
      <div>
        <div className="row">
          <div className="col-6 currency_type">
            <Select
              value={this.state.currencyType}
              options={optionsCurrencyType}
              className="currency_type_select"
              defaultValue={{
                value: "dollar",
                label: "Dollar $"
              }}
              onChange={this.handleCurrencyType}
              multi={false}
              styles={customStyles}
            />
          </div>
          <div className="col-6 pay_medium_type">
            <Select
              value={this.state.payMedium}
              options={optionsPayMedium}
              className="pay_medium_select"
              defaultValue={{
                value: "cash",
                label: "Cash $"
              }}
              onChange={this.handlePayMedium}
              multi={false}
              styles={customStyles}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-6 amount_paid_col">
            Pay :&nbsp;$&nbsp;
            <input
              name="amountPaid"
              type="number"
              min="0.01"
              // max="100.00"
              className="amount_paid"
              onChange={this.onChangeAmtPaid}
              value={this.state.amountPaid}
              step="1"
            />
          </div>
          <div className="col-6 amt_due">
            IOU (due):&nbsp;$&nbsp;
            <font color="red">{this.state.amountPending.toFixed(2)}&nbsp;</font>
          </div>
        </div>
        <div className="row">
          <div className="col-3 text-right">Pay by:</div>
          <div className="col-9 text-left date_picker_sizing">
            {" "}
            <DatePicker
              selected={this.state.payByDate}
              onChange={this.handlePayByDate}
              // onSelect={this.handlePayByDate}
              name="payByDate"
              dateFormat="MM/DD/YYYY"
            />
          </div>
        </div>
        <div className="paypanel_spacing" />
        {payFinalPanel}
      </div>
    );

    // This handles - types of installment and whether you want to specify number of installment or amount of installment
    let payPanelB1;
    payPanelB1 = (
      <div>
        <div className="row">
          <div className="col-6 paypanelb1">Installment Type:</div>
          <div className="col-6 install_select float-left">
            <Select
              value={this.state.installmentType}
              options={optionsInstallmentType}
              className="installment_type_select"
              defaultValue={{
                value: "monthly",
                label: "Monthly"
              }}
              onChange={this.handleInstallmentType}
              multi={false}
              styles={customStyles}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-1">&nbsp;</div>
          <div className="col-10 amount_paid_col">
            Amount Pay Now:&nbsp;$&nbsp;&nbsp;
            <input
              name="amountPaid"
              type="number"
              min="0.01"
              // max="100.00"
              className="amount_paid"
              onChange={this.onChangeUpfrontAmtPaid}
              value={this.state.amountPaid}
              step="1"
            />
          </div>
          <div className="col-1">&nbsp;</div>
        </div>
        <div className="row">
          <div className="col-1">&nbsp;</div>
          <div className="col-10 amount_paid_col">
            Number of Installment:&nbsp;$&nbsp;&nbsp;
            <input
              name="noOfInstallment"
              type="number"
              min="0.01"
              // max="100.00"
              className="no_of_installment"
              onChange={this.onChangeNoOfInstallment}
              value={this.state.noOfInstallment}
              step="1"
            />
          </div>
          <div className="col-1">&nbsp;</div>
          <div className="row">
            <div className="col-1">&nbsp;</div>
            <div className="col-10 amt_per_installment">
              Amount Per Installment: $&nbsp;
              {this.state.amountPerIstallment.toFixed(2)}
            </div>
            <div className="col-1">&nbsp;</div>
          </div>
        </div>
        {installmentSpec}
        {payFinalPanel}
      </div>
    );

    let payProcessingPanel;
    if (this.state.payProcessHandlingFlag) {
      // console.log("this.state.paySchedule:", this.state.paySchedule);
      // console.log("value: ", this.state.paySchedule.value);
      if (this.state.paySchedule.value === "fullpay") {
        payProcessingPanel = (
          <div>
            <div className="text-center">
              <b>Pay Process</b>
            </div>
            {payPanel1}
            {payPanel2}
            <hr className="adjust_pos" />
          </div>
        );
      } else if (this.state.paySchedule.value === "partpay") {
        payProcessingPanel = (
          <div>
            <div className="text-center">
              <b>Pay Process</b>
            </div>
            {payPanel1}
            {payPanelA}
            <hr className="adjust_pos" />
          </div>
        );
      } else if (this.state.paySchedule.value === "installment") {
        payProcessingPanel = (
          <div>
            <div className="text-center">
              <b>Pay Process</b>
            </div>
            {payPanel1}
            {payPanelB1}
            <hr className="adjust_pos" />
          </div>
        );
      } else {
        payProcessingPanel = null;
      }
    }

    let totalCostdisp = parseFloat(this.state.totalcost.toFixed(2));
    let discountAmtdisp = parseFloat(
      (totalCostdisp * (this.state.discount / 100)).toFixed(2)
    );
    let salesTaxdisp = parseFloat(
      ((totalCostdisp - discountAmtdisp) * (this.state.tax / 100)).toFixed(2)
    );
    let processingFeedisp = parseFloat(
      (
        (totalCostdisp - discountAmtdisp) *
        (this.state.processingFee / 100)
      ).toFixed(2)
    );
    let grandTotaldisp = (
      totalCostdisp -
      discountAmtdisp +
      salesTaxdisp
    ).toFixed(2);

    let checkoutTotalPanel;
    if (this.state.checkoutFlag) {
      checkoutTotalPanel = (
        // <div className="cost_panel_placement">
        <div>
          <div className="total_panel_spacing" />
          <div className="row">
            <div className="col-9 text-right total_text_format">
              Total Amount:
            </div>
            <div className="col-3 text-right total_text_value">
              {/* {this.state.totalcost.toFixed(2)}&nbsp;$ */}
              $&nbsp;{totalCostdisp.toFixed(2)}
            </div>
          </div>
          <div className="row total_text_rows">
            <div className="col-5 text-center total_text_format">Discount:</div>
            <div className="col-4 text-center total_text_format">
              <input
                name="discount"
                type="number"
                min="0"
                max="100.00"
                className="discount_per"
                onChange={this.onChange}
                value={this.state.discount}
                step="1"
              />
            </div>
            <div className="col-3 text-right total_text_value">
              {/* {(this.state.totalcost * (this.state.discount / 100)).toFixed(2)} */}
              $&nbsp;{discountAmtdisp.toFixed(2)}
            </div>
          </div>
          <div className="row">
            <div className="col-5 text-center total_text_format">
              Sales Tax:
            </div>
            <div className="col-4 text-center total_text_format">
              <input
                name="tax"
                type="number"
                min="0"
                max="100.00"
                className="discount_per"
                onChange={this.onChange}
                value={this.state.tax}
                step="1"
              />
            </div>
            <div className="col-3 text-right total_text_value">
              $&nbsp;{salesTaxdisp.toFixed(2)}
            </div>
          </div>
          <div className="row">
            <div className="col-5 text-center total_text_format">
              Processing:&nbsp; <font color="red">X</font>
            </div>
            <div className="col-4 text-left total_text_format">
              {/* <input
                name="processingFee"
                type="number"
                min="0"
                max="100.00"
                className="discount_per"
                onChange={this.onChange}
                value={this.state.processingFee}
                step="1"
              /> */}
              &nbsp;&nbsp;{this.state.processingFee.toFixed(2)}&nbsp;%
            </div>
            <div className="col-3 text-right processing_fee">
              {/* {(
                (this.state.totalcost -
                  this.state.totalcost * (this.state.discount / 100)) *
                (this.state.processingFee / 100)
              ).toFixed(2)} */}
              $&nbsp;{processingFeedisp.toFixed(2)}
            </div>
          </div>

          <div className="row">
            <div className="col-9 text-right total_text_format">
              Grand Total: (to pay)
            </div>
            <div className="col-3 text-right total_text_value">
              {/* <div>The following is GrandTotal = (Items Total - discount + tax + processingFee) </div> */}
              {/* {(
                this.state.totalcost * -
                this.state.totalcost * (this.state.discount / 100) +
                (this.state.totalcost -
                  this.state.totalcost * (this.state.discount / 100)) *
                  (this.state.tax / 100) +
                (this.state.totalcost -
                  this.state.totalcost * (this.state.discount / 100)) *
                  (this.state.processingFee / 100)
              ).toFixed(2)} */}
              $&nbsp;{grandTotaldisp}
            </div>
          </div>
          <div className="row">
            <div className="col text-right pay_buttons_pos">
              {!this.state.paymentDoneFlag ? (
                <div>
                  <button
                    className="btn_pay"
                    type="button"
                    onClick={this.handlePay}
                  >
                    Pay&nbsp;
                    <i className="fas fa-money-check" />
                  </button>
                  &nbsp;
                  <button
                    className="btn_pay"
                    type="button"
                    onClick={this.handleBuy}
                  >
                    Buy&nbsp;
                    <i className="fas fa-shopping-cart" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      );
    }

    // Select member / customer here ... should be in separate component
    // with a props function in this ... to be invoked there if customer change
    // mind ... must have a 'Done' bubtton to take them to POS landing screen.
    if (this.state.checkoutFlag) {
      selectItemdropdown = (
        <div>
          <div className="row">
            <div className="col text-center div_pos_item_select">
              <select
                size={selheight}
                onChange={this.handleItemSelected}
                className="pos_item_select"
              >
                {sellist}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col text-center select_item_msg">
              Please select your customer by name
            </div>
          </div>
        </div>
      );
    }

    let searchInputPanel;
    searchInputPanel = (
      <div className="text-center">
        <div className="row searchpanel_placement">
          <div className="col-10 search_input_placement">
            <input
              name="searchItemName"
              type="text"
              value={this.state.searchItemName}
              onChange={this.onChangeItemName}
              size="50"
              maxLength="50"
              className="input_text_pos"
              placeholder="Item name to sell."
            />
            <div
              className={`${
                !this.state.posItemNameErrFlag
                  ? "pos_input_msg"
                  : "pos_input_msg_err"
              }`}
            >
              <p>{this.state.posItemNameMsg}</p>
            </div>
          </div>
          <div className="col-2 text-left">
            <button
              className="btn_goPosItemFind"
              type="button"
              onClick={this.handleFind}
            >
              <i className="fas fa-search" />
            </button>
          </div>
        </div>
        <div>{selectItemdropdown}</div>
      </div>
    );

    let qtyInputPanel;
    console.log('>>>>>>> this.state.selectedItemInventory: ', this.state.selectedItemInventory);
    if (this.state.selectedItemInventory > 0) {
      qtyInputPanel = (
        <div>
          <div className="row">
            <div className="col-6 text-left cost_cell_placement">
              &nbsp;Quantity: &nbsp;&nbsp;
              <input
                name="itemQty"
                type="number"
                min="1"
                max="99999"
                className="item_qty"
                value={this.state.itemQty}
                step="1"
                onChange={this.qtyOnChange}
              />
            </div>
            <div className="col-6 text-left cost_cell_placement">
              Cost:&nbsp;&nbsp;
              <font color="green">
                {this.state.calculatedItemCost.toFixed(2)}
              </font>
            </div>
          </div>
        </div>
      );
    } else {
      qtyInputPanel = (
        <div>
          <div className="row">
            <div className="col text-center cost_cell_placement">
              <font color="red">No Inventory to Sell</font>
            </div>
          </div>
        </div>
      );
    }

    let buyItemErrPanel;
    if (this.state.buyItemErrFlag) {
      buyItemErrPanel = (
        <div className="text-center buy_item_err">
          Can not sell more than the stock
        </div>
      );
    } else {
      buyItemErrPanel = null;
    }

    let buyItemsPanel;
    if (this.state.itemToBuyFlag) {
      buyItemsPanel = (
        <div className="cost_panel_placement">
          <div className="row">
            <div className="col text-left cost_cell_placement">
              &nbsp;Item:{" "}
              <font color="#1844a3">
                <b>{this.state.selectedItemName}</b>
              </font>
            </div>
          </div>
          <div className="row">
            <div className="col-6 text-left cost_cell_placement">
              &nbsp;Price:&nbsp;&nbsp;{this.state.selectedItemPrice}
            </div>
            <div className="col-6 text-left cost_cell_placement">
              Available:&nbsp;&nbsp;{this.state.selectedItemInventory}
            </div>
          </div>
          {qtyInputPanel}
          <div className="row">
            <div className="col-6">
              <div
                className={`${
                  !this.state.costQtyErrFlag
                    ? "pos_input_msg"
                    : "pos_input_msg_err"
                }`}
              >
                {this.state.costPanelMessage}
              </div>
            </div>
            <div className="col-6">
              <button
                className="btn_costPanel_clear"
                type="button"
                onClick={this.handleClearCostPanel}
              >
                Clear&nbsp;
                <i className="fas fa-minus" />
              </button>
              &nbsp;&nbsp;
              <button
                className="btn_costPanel_add"
                type="button"
                onClick={this.handleAddCostPanel}
              >
                Add&nbsp;
                <i className="fas fa-plus" />
              </button>
            </div>
          </div>
          {buyItemErrPanel}
        </div>
      );
    } else {
      buyItemsPanel = null;
    }

    let searchErrMsgPanel;
    if (this.state.searchAndEditErrorFlag) {
      searchErrMsgPanel = (
        <div className="row">
          <div className="col text-center pos_input_msg_err">
            {this.state.searchAndEditMsg}
          </div>
        </div>
      );
    } else {
      searchErrMsgPanel = null;
    }

    let yourCartPanel;
    if (!this.state.checkoutFlag) {
      if (this.state.showTheCartFlag) {
        //   console.log("this.state.selectedMembers:", this.state.selectedMembers);
        yourCartPanel = (
          <div>
            <div className="spacing_cart_panel" />
            <div className="row">
              <div className="col-9 new_cart_header text-center">
                Items In Your Cart
              </div>
              <div className="col-3 text-left">
                {this.state.itemsInCart.length === 0 ? null : (
                  <button
                    className="btn_checkout"
                    type="button"
                    onClick={this.handlecheckout}
                  >
                    Checkout&nbsp;
                    <i className="fas fa-shopping-cart" />
                  </button>
                )}
              </div>
            </div>
            {searchErrMsgPanel}
            {this.state.itemsInCart.map((obj, i) => (
              <div key={i}>
                <div className="row">
                  <div className="col-9 show_items text-left">
                    <button
                      className="btn_delete_item"
                      type="button"
                      onClick={() => this.handleDeleteMember(obj)}
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                    &nbsp;&nbsp;
                    {/* <i className="fas fa-check-circle" /> */}
                    &nbsp;
                    {obj.itemName}&nbsp;(Qty:{obj.itemQty})
                  </div>
                  <div className="col-3 cart_costs text-right">
                    {(obj.itemPrice * obj.itemQty).toFixed(2)}&nbsp;$
                  </div>
                </div>
              </div>
            ))}
            <hr className="adjust_pos" />
            <div className="space_below" />
          </div>
        );
      }
    } else {
      // if (this.state.showTheCartFlag) {
      //   console.log("this.state.selectedMembers:", this.state.selectedMembers);
      yourCartPanel = (
        <div>
          <hr className="adjust_pos" />
          <div className="spacing_cart_panel" />
          <div className="row">
            <div className="col new_cart_header text-center">
              Items In Your Cart at Checkout
            </div>
          </div>

          {this.state.itemsInCart.map((obj, i) => (
            <div key={i}>
              <div className="row">
                <div className="col-9 show_items_cart text-left">
                  {/* <button
                      className="btn_checkout_item"
                      type="button"
                      // onClick={() => this.handleDeleteMember(obj)}
                    > */}
                  <i className="fas fa-shopping-cart" />
                  {/* </button> */}
                  &nbsp;&nbsp;
                  {/* <i className="fas fa-check-circle" /> */}
                  &nbsp;
                  {obj.itemName}&nbsp;(Qty:{obj.itemQty})
                </div>
                <div className="col-3 cart_costs text-right">
                  {(obj.itemPrice * obj.itemQty).toFixed(2)}&nbsp;$
                </div>
              </div>
            </div>
          ))}
          {/* <hr className="adjust_pos" /> */}
          <div className="space_below" />
        </div>
      );
      // }
    }

    let posOutputPanel;
    if (this.state.reviewFlag) {
      console.log("Going to PosReview");
      posOutputPanel = (
        <div>
          <PosReview
            posState={this.state}
            returnToPos={this.handleReturnToPos}
            communityid={this.props.communityid}
            manageCustomer={this.handleCustomerCheckout}
          />
        </div>
      );
    } else if (this.state.customerHandlingFlag) {
      // console.log("This is where we need to get customer info and finalize");
      posOutputPanel = (
        <div>
          <PosFinish
            posState={this.state}
            communityid={this.props.communityid}
            returnToPos={this.handleReturnToPos}
            saleCompleteExit={this.handleSaleComplete}
            manageCustomer={this.handleCustomerCheckout}
          />
        </div>
      );
    } else {
      if (!this.state.checkoutFlag) {
        posOutputPanel = (
          <div>
            {searchInputPanel}
            {buyItemsPanel}
            {yourCartPanel}
          </div>
        );
      } else {
        posOutputPanel = (
          <div>
            {payProcessingPanel}
            {checkoutTotalPanel}
            {yourCartPanel}
          </div>
        );
      }
    }
    // posOutputPanel = <div>{searchInputPanel}</div>;

    return <div className="fixedsize_pos">{posOutputPanel}</div>;
  }
}

Pos.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(withRouter(Pos));

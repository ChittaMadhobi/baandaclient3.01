import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
// import _ from "lodash";

import "./Pos.css";

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const serchItemToEdit = "/routes/dashboard/searchItemToEdit?";

let options = [];
let itemsInCartArray = [];

class Pos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItemName: "",
      selectedItemId: 0,
      selectedItemPrice: 0.0,
      selectedItemInventory: 0,
      itemQty: '',
      calculatedItemCost: 0.0,
      costQtyErrFlag: false,

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
      showTheCartFlag: false
    };
  }

  async componentWillUnmount() {
    // console.log("I am in component will mount");
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
    this.props.history.goForward();
  }

  componentDidMount = async () => {
    // call to get the joiningProcess from communities using communityId
    // call getPosInitData()
    await this.getPosInitData();
  };

  getPosInitData = () => {
    // console.log("I am into getPosInitData");
  };

  onChange = async e => {
    // console.log("name: ", [e.target.name], " value:", e.target.value);
    await this.setState({ [e.target.name]: e.target.value });
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
      itemToBuyFlag: false
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
        // console.log('msg:', ret.data.Msg);
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
          this.prepForSell(ret.data.Msg[0]);
        } else {
          let option = {};
          options = [];
          ret.data.Msg.forEach(async obj => {
            option = {
              value: obj.itemId,
              label: obj
              // price: obj.itemPrice,
              // inventory: obj.currentInventory
            };
            options.push(option);
            // console.log("obj:", obj, " itemId:", obj.itemId);
          });
          // console.log('option', options);
          await this.setState({
            itemSelectToBuyFlag: true,
            searchAndEditMsg: "Please scroll & select an item.",
            item: options,
            searchAndEditErrorFlag: false
          });
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
    await this.setState({
      itemSelectToBuyFlag: false,
      itemToBuyFlag: true,
      selectedItemName: data.itemName,
      selectedItemId: data.itemId,
      selectedItemPrice: data.itemPrice,
      calculatedItemCost: 0.0,
      itemQty: '',
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
      itemQty: '',
      costPanelMessage: "",
      itemToBuyFlag: false
    });
  };

  handleAddCostPanel = async () => {
    // alert("On handleAddCostPanel");
    if (this.state.itemQty && this.state.itemQty !== 0) {
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
        itemQty: '',
        costPanelMessage: "",
        itemsInCart: itemsInCartArray,
        itemToBuyFlag: false
      });
    } else {
      await this.setState({
        costQtyErrFlag: true
      });
    }

    // console.log("itemsInCartArray:", itemsInCartArray);
  };

  handleDeleteMember = async item => {
    // let itemObj = JSON.parse(item);
    console.log("to be deleted item:", item);
    let index = itemsInCartArray.findIndex(x => x.itemId === item.itemId);
    console.log("handleDeleteMember index:", index);

    itemsInCartArray.splice(index, 1);
    await this.setState({
      itemsInCart: itemsInCartArray
    });
  };

  prepForSell = data => {
    console.log("prepForSell data:", data);
  };

  handlecheckout = () => {
    alert('will handle checkout ...');
  }

  render() {
    // console.log("Pos props:", this.props);
    // console.log("this.state:", this.state);

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
              <font color="green">{this.state.calculatedItemCost.toFixed(2)}</font>
            </div>
          </div>
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
        </div>
      );
    } else {
      buyItemsPanel = null;
    }

    let yourCartPanel;
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
                 Checkout&nbsp;<i className="fas fa-shopping-cart" />
                </button>
              )}
            </div>
          </div>
          
          {this.state.itemsInCart.map((obj, i) => (
            <div key={i}>
              <div className="row">
                <div className="col-9 show_old_member text-left">
                  <button
                    className="btn_delete_member"
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

    let posOutputPanel;
    posOutputPanel = <div>{searchInputPanel}</div>;

    return (
      <div className="fixedsize_pos">
        {posOutputPanel}
        {buyItemsPanel}
        {yourCartPanel}
      </div>
    );
  }
}

Pos.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(withRouter(Pos));

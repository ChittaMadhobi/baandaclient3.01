import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import "./Inventory.css";

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;

const serchItemToEdit = "/routes/dashboard/searchItemToEdit?";
const updateInventory = "/routes/dashboard/updateInventory";

let options = [];

class Inventory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",

      searchItemName: "",
      itemNameErrFlag: false,
      itemSelectToEditFlag: false,
      searchAndEditMsg: "",
      searchAndEditErrorFlag: true,
      itemNameMsg: "Please enter part/full item to search-filter",
      item: [],

      showAdjustPanelFlag: false,
      inventoryMsgErrFlag: false,
      inventoryUpdateSuccessFlag: false,
      itemName: '',
      itemId: 0,
      adjustType: "Add",
      inventory: 0,
      adjInventory: 0,
      adjustmentComment: "",
      inventoryMsg: "Enter adjust inventory qty and adjustment type."
    };
  }

  handleFind = async () => {
    let ifExists = true;
    let params =
      "communityId=" +
      this.props.communityid +
      "&itemName=" +
      this.state.searchItemName;
    let url = baandaServer + serchItemToEdit + params;
    try {
      let ret = await axios.get(url);
      if (ret.data.status === "Error") {
        throw new Error(`No items found with this condition`);
      } else {
        if (ret.data.Msg.length === 0) {
          await this.setState({
            itemSelectToEditFlag: false,
            searchAndEditMsg:
              "No item found with your filter. Try again please.",
            searchAndEditErrorFlag: true
          });
        }
        else {
          let option = {};
          options = [];
          ret.data.Msg.forEach(async obj => {
            option = {
              value: obj.itemId,
              label: obj
            };
            options.push(option);
          });
          if (ret.data.Msg.length === 1) {
            await this.setState({
              itemSelectToEditFlag: true,
              searchAndEditMsg: "",
              item: options,
              searchAndEditErrorFlag: false
            });
            // Only one row returned - go to inventory entry screen directly
            this.prepForInventoryEntry(ret.data.Msg[0]);
          } else {
            await this.setState({
              itemSelectToEditFlag: true,
              searchAndEditMsg: "Select an item to adjust inventory.",
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

  onChangeText = async e => {
    await this.setState({
      [e.target.name]: e.target.value
    });
    let letterNumber = /^[\w\-\s]+$/;
    if (!this.state.searchItemName.match(letterNumber)) {
      if (this.state.searchItemName.length > 0){
        await this.setState({
          itemNameErrFlag: true,
          itemNameMsg: "Only Alphanumeric, space, -, _ is allowed."
        });  
      } else {
        await this.setState({
          itemNameErrFlag: false,
          itemNameMsg: "Enter part/full to search-filter. Blank for whole catalog."
        });  
      }
    } else {
      await this.setState({
        itemNameErrFlag: false,
        itemNameMsg: "Enter part/full to search-filter. Blank for whole catalog."
      });
    }
  };

  onChange = async e => {
    await this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleItemSelected = async e => {
    let data = JSON.parse(e.target.value);
    this.prepForInventoryEntry(data);
  };

  prepForInventoryEntry = async data => {
    await this.setState({
      showAdjustPanelFlag: true,
      itemName: data.itemName,
      itemId: data.itemId,
      adjustType: "Add",
      inventory: data.currentInventory,
      adjInventory: 0,
      adjustmentComment: "",
      inventoryMsg: "Enter adjust inventory qty and adjustment type.",
      inventoryUpdateSuccessFlag: false
    })
  };

  setCustomValidity = msg => {
    alert("Msg:" + msg);
  };

  handleAdjustType = async e => {
    await this.setState({
      adjustType: e.target.value
    });
  };

  validateAndSave = async () => {
    let isValid = true;
    let errMsg="";
    
    let adjqty = 0;
    if (_.isString(this.state.adjInventory)) {
      if (this.state.adjInventory === "0" || this.state.adjInventory === "") {
        adjqty = 0;
      } else {
        adjqty = parseFloat(this.state.adjInventory).toFixed(0);
      }
    } else if (!isNaN(this.state.adjInventory)) {
      if (this.state.adjInventory === 0) {
        adjqty = 0;
      } else {
        adjqty = this.state.adjInventory.toFixed(0);
      }
    }
    
    if ( adjqty === 0) {
      isValid=false;
      errMsg = errMsg + 'No Adjust quantity entered. '
    }
    if ( this.state.adjustmentComment.length < 15) {
      isValid = false;
      errMsg = errMsg + `Minimum comment length must be 15 chars (now ${this.state.adjustmentComment.length} chrs) `;
    }
    console.log('validateAndSave isValid before updateInventory:', isValid);
    if ( isValid ) {
      await this.updateInventory();
    } else {
      await this.setState({
        inventoryMsg: errMsg,
        inventoryMsgErrFlag: true
      })
    }
  };

  updateInventory = async() => {
    let retval = true;
    let data = {
      baandaId: this.props.auth.user.baandaId,
      communityId: this.props.communityid,
      itemId: this.state.itemId,
      adjustmentType: this.state.adjustType, 
      inventoryQty: this.state.adjInventory,
      unit: 'Each',
      comment: this.state.adjustmentComment,
      transactionOrigin: 'Adjustment',
      originTransId: 0  // Used for PO, POS etc.
    }
    let url = baandaServer + updateInventory;
    console.log('updateInventory url: ', url, ' data:', data);
    alert('check url and data before axios.post ');
    try {
      let ret = await axios.post(url, data);

      console.log('After db call - ret:', ret.data);
      // Initialize for new create
      if ( ret.data.status === 'Success') {
        await this.setState({
          saveValidFlag: false,
          saveReviewMsg: ret.Msg,
          inventoryUpdateSuccessFlag: true,
          showAdjustPanelFlag: false
        });
        await this.handleFind();
        this.returnToAccessList();
      }
    } catch(err) {
      await this.setState({
        saveValidFlag: true,
        saveReviewMsg: 'Faied to update. Contact Baanda support.'
      });
      retval = false;
      console.log('updateitem err:', err);
    }

    return retval;
  }

  returnToAccessList = async () => {
    await this.setState({
      showAdjustPanelFlag: false,
      inventoryMsgErrFlag: false,
      itemName: '',
      itemId: 0,
      adjustType: "Add",
      adjInventory: 0,
      adjustmentComment: "",
      inventoryMsg: "Enter adjust inventory qty and adjustment type."
    });

  };

  render() {
    // console.log("Inventory props:", this.props);
    // console.log('this.state:', this.state);

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
    if (this.state.itemSelectToEditFlag) {
      selectItemdropdown = (
        <div>
          <div className="row select_panel_inventory">
            <div className="col text-center div_item_select">
              <select
                size={selheight}
                onChange={this.handleItemSelected}
                className="item-select"
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
    if (this.state.searchAndEditErrorFlag) {
      selectItemdropdown = (
        <div>
          <div className="row">
            <div className="col text-center select_item_msg_err">
              {this.state.searchAndEditMsg}
            </div>
          </div>
        </div>
      );
    }

    let searchPanel = (
      <div className="text-center">
        <div className="row searchpanel_placement_inventory">
          <div className="col-10 search_input_placement">
            <input
              name="searchItemName"
              type="text"
              value={this.state.searchItemName}
              onChange={this.onChangeText}
              size="50"
              maxLength="50"
              className="input_text_inventory"
              placeholder="Item name to search-filter"
              // pattern="[a-zA-Z0-9\s]"
              // onInvalid={() => this.setCustomValidity('Please enter alphabets and numbers only.')}
            />
            <div
              className={`${
                !this.state.itemNameErrFlag
                  ? "inventory_input_msg"
                  : "inventory_input_msg_err"
              }`}
            >
              <p>{this.state.itemNameMsg}</p>
            </div>
          </div>
          <div className="col-2 search_go_btn_placement text-left">
            <button
              className="btn_goFind_inventory"
              type="button"
              onClick={this.handleFind}
            >
              <i className="fas fa-search" />
            </button>
            &nbsp;
          </div>
        </div>
        <div>{selectItemdropdown}</div>
      </div>
    );

    let adjustPanel;

    if (this.state.showAdjustPanelFlag) {
      adjustPanel = (
        <div>
          <hr />
          <div className="row">
            <div className="col text-center adjust_panel_header">
              Inventory Adjustment Panel 
            </div>
          </div>
          <div className="row">
            <div className="col text-left itemname_row_placement">
              <b>Name: </b> {this.state.itemName} &nbsp;&nbsp; <b>Id: </b>
              {this.state.itemId}
            </div>
          </div>
          <div className="row">
            <div className="col text-center radio-inventory-fonts">
              <strong>Adjustment Type: &nbsp;&nbsp;</strong>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="Add"
                    checked={this.state.adjustType === "Add"}
                    onChange={this.handleAdjustType}
                  />{" "}
                  Add
                </label>
              </div>
              <div className="form-check form-check-inline">
                <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="Subtract"
                    checked={this.state.adjustType === "Subtract"}
                    onChange={this.handleAdjustType}
                  />{" "}
                  Subtract
                </label>
              </div>
            </div>
          </div>
          <div className="row inventory_row_placement">
            <div className="col-5 text-left ">
              <b>Inventory Now: </b>
              {this.state.inventory} &nbsp; #
            </div>
            <div className="col-2"><b>Adjust:</b></div>
            <div className="col-5 text-left">
              <input
                name="adjInventory"
                type="number"
                min="0.00"
                value={this.state.adjInventory}
                onChange={this.onChange}
                size="15"
                // maxLength="50"
                className="input_adjust_field"
                step="1"
                placeholder="0"
                autoComplete="off"
              />
            </div>
            {/* <div className="col-1">&nbsp;</div> */}
          </div>
          <div className="row inventory_comment_placement">
            <div className="col-2"><b>Comment:</b></div>
            <div className="col-10">
              <textarea
                name="adjustmentComment"
                maxLength="1000"
                placeholder="Write short adjustment description (min 15 chars)."
                rows="3"
                wrap="hard"
                spellCheck="true"
                className="inventory_comment"
                onChange={this.onChange}
                value={this.state.adjustmentComment}
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
          <div className="row inventory_msg_placement">
            <div className="col-7">
                <div className={`${
                  !this.state.inventoryMsgErrFlag
                    ? "inventory_msg text-center"
                    : "inventory_msg_err text-center"
                }`}
              >{this.state.inventoryMsg}</div>
            
            </div>
            <div className="col-5">
              <button
                className="btn-adjust-save"
                type="button"
                onClick={this.validateAndSave}
                style={{ cursor: this.state.disabled ? "default" : "pointer" }}
              >
                <b>Save</b>
              </button>
              &nbsp;&nbsp;
              <button
                className="btn-adjust-cancel"
                type="button"
                onClick={this.returnToAccessList}
                style={{ cursor: this.state.disabled ? "default" : "pointer" }}
              >
                <b>Cancel</b>
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      adjustPanel = null;
    }

    let updateSuccessPanel;
    if ( this.state.inventoryUpdateSuccessFlag ){
      updateSuccessPanel = (
        <div>
          <hr />
          <p className="text-center show_update_success">Update successful... </p>
        </div>
      )
    }
    return (
      <div >
        {searchPanel}
        <div>{adjustPanel}</div>
        <div>{updateSuccessPanel}</div>
      </div>
    );
  }
}

Inventory.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

//   const mapDispatchToProps = dispatch => ({
//     // hideModal: () => dispatch(hideModal()),
//     // showModal: (modalProps, modalType) => {
//     //   // console.log(
//     //   //   "modalProps:" + JSON.stringify(modalProps) + "  |modalType:" + modalType
//     //   // );
//     //   dispatch(showModal({ modalProps, modalType }));
//     // }
//     // setQAInitDone: () => dispatch(setQAInitDone(userData))
//   });

export default connect(
  mapStateToProps
  // mapDispatchToProps
)(withRouter(Inventory));

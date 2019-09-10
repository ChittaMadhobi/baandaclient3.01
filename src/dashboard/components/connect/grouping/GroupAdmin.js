import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import * as EmailValidator from "email-validator";
import axios from "axios";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

// import _ from "lodash";

import ModalContainer from "../../../../modal/components/ModalContainer";
import { showModal, hideModal } from "../../../../actions/modalActions";
import "../../../../modal/css/localModal.css";
import "../../../../modal/css/template.css";

import Invite from './EditInvite';

import "./GroupAdmin.css";

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const ifGroupExistsAPI = "/routes/dashboard/ifGroupExists?";
const createNewGroupAPI = "/routes/dashboard/createNewGroup";
const saveGetGroupMembers = "/routes/dashboard/saveGetGroupMembers";
const getGroupsOfCommunity = "/routes/dashboard/getGroupsOfCommunity?";
const updateGroupAPI = "/routes/dashboard/updateGroup";
const deleteGroupMember = "/routes/dashboard/deleteGroupMember";

let groupOptions = [];

class GroupAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",

      createGroupFlag: true,
      editGroupFlag: false,
      viewGroupFlag: false,

      groupName: "",
      groupNameMsg: "A unique group name (5-to-50 chars)",
      groupNameErrFlag: false,
      groupDescription: "",
      groupDescriptionMsg: "Enter a description for the group (25-250 chrs)",
      groupDescriptionErrFlag: false,
      groupCreatedFlag: false,
      groupId: 0,
      createGroupMsg: "Enter group information.",
      createGroupMsgErrFlag: false,

      newMemberPanelFlag: false,
      editMemberPanelFlag: false,
      viewMemberPanelFlag: false,
      editMemberListFlag: false,
      memberName: "",
      memberNameMsg: "Enter name. (5 - 50 chars)",
      memberNameErrFlag: false,
      email: "",
      emailMsg: "Enter a valid email.",
      emailErrFlag: false,
      cell: "",
      cellMsg: "Enter Cell# (optional).",
      cellErrFlag: false,

      searchGroupName: "",
      searchGroupMsg: "Enter part/full group name to search-filter.",
      searchGRoupErrFlag: false,

      memberMsg:
        "Duplicate email will be ignored. Delete & re-enter to change member info.",
      memberMsgErrFlag: false,
      selectedMembers: null,

      groupSelectedToEditFlag: false,
      groups: null,
      groupsSelectedErrFlag: false,

      showgroupEditPanelFlag: false,
      showEditAddNewMemberPanelFlag: false,
      showMemberEditPanelFlag: false
    };
  }

  openAlertModal = () => {
    let msg = {
      Header: "Group Handling",
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

  onChange = async e => {
    await this.setState({ [e.target.name]: e.target.value });
  };

  onChangeMemberName = async e => {
    await this.setState({
      [e.target.name]: e.target.value
    });
    let letterNumber = /^[\w\-.\s]+$/;
    if (!this.state.memberName.match(letterNumber)) {
      if (this.state.memberName.length > 0) {
        await this.setState({
          memberNameErrFlag: true,
          memberNameMsg: "Only Alphanumeric, space, -, _ is allowed."
        });
      } else {
        await this.setState({
          memberNameErrFlag: false,
          memberNameMsg: "Enter name (5 to 50 chars.)."
        });
      }
    } else {
      await this.setState({
        memberNameErrFlag: false,
        memberNameMsg: "Enter name (5 to 50 chars.)"
      });
    }
  };

  onChangeText = async e => {
    //   alert('>>>>>> I am in onChangeText ...');
    await this.setState({
      [e.target.name]: e.target.value
    });
    // console.log("this.state.searchGroupName:", this.state.searchGroupName);
    let letterNumber = /^[\w\-\s]+$/;
    if (!this.state.searchGroupName.match(letterNumber)) {
      if (this.state.searchGroupName.length > 0) {
        await this.setState({
          searchGroupErrFlag: true,
          searchGroupMsg: "Only Alphanumeric, space, -, _ is allowed."
        });
      } else {
        await this.setState({
          searchGroupErrFlag: false,
          searchGroupMsg:
            "Enter part/full to search-filter. Blank for whole catalog."
        });
      }
    } else {
      await this.setState({
        searchGroupErrFlag: false,
        searchGroupMsg:
          "Enter part/full to search-filter. Blank for whole catalog."
      });
    }
  };

  handleEdit = async () => {
    await this.setState({
      createGroupFlag: false,
      editGroupFlag: true,
      viewGroupFlag: false,
      newMemberPanelFlag: false,
      editMemberPanelFlag: false,
      viewMemberPanelFlag: false,
      editMemberListFlag: false,
      inviteFlag: false
    });
  };

  handleCreate = async () => {
    await this.setState({
      createGroupFlag: true,
      editGroupFlag: false,
      viewGroupFlag: false,
      groupCreatedFlag: false,
      groupName: "",
      groupDescription: "",
      showgroupEditPanelFlag: false,
      showEditAddNewMemberPanelFlag: false,
      showMemberEditPanelFlag: false,
      selectedMembers: null,
      newMemberPanelFlag: false,
      editMemberPanelFlag: false,
      viewMemberPanelFlag: false,
      editMemberListFlag: false,
      inviteFlag: false
    });
  };

  handleView = async () => {
    await this.setState({
      createGroupFlag: false,
      editGroupFlag: false,
      viewGroupFlag: true,
      inviteFlag: false
    });
  };

  handleInvite = async () => {
    // alert("Handle Invite");
    await this.setState({
      createGroupFlag: false,
      editGroupFlag: false,
      viewGroupFlag: false,
      inviteFlag: true
    });
  };

  handleCreateGroup = async () => {
    // alert("handleCreateGroup ... step-by-step. before validateNewGroup.");
    let validate = await this.validateNewGroup();
    // console.log("validate:", validate);
    if (validate) {
      // Call createNewGroup
      let data = {
        baandaId: this.props.auth.user.baandaId,
        communityId: this.props.communityid,
        groupName: this.state.groupName,
        groupDescription: this.state.groupDescription
      };

      // console.log("handleCreateGroup data:", data);
      let url = baandaServer + createNewGroupAPI;
      // console.log("url: ", url);
      try {
        let ret = await axios.post(url, data);
        // console.log("handle create Group ret:", ret);
        if (ret.data.status === "Success") {
          await this.setState({
            groupCreatedFlag: true,
            groupDescriptionMsg: "Group Created. Enter members.",
            groupDescriptionErrFlag: false,
            groupId: ret.data.Msg.groupId
          });
          let data = {
            communityId: this.props.communityid,
            groupId: ret.data.Msg.groupId,
            requestType: "SelectMembers",
            member: {},
            ascDsc: "dsc"
          };
          // console.log("handleCreateGroup data:", data);
          // let retMember = await this.addSelectMemberList(data);
          await this.addSelectMemberList(data);
          // console.log("handleCreateGroup retMember:", retMember);
          // await this.setState({
          //   selectedMembers: retMember
          // });
        } else {
          await this.setState({
            groupCreatedFlag: false,
            groupDescriptionMsg: ret.data.Msg,
            groupDescriptionErrFlag: true
          });
        }
      } catch (err) {
        console.log("CreateNewGroupAPI call error:", err.message);
        await this.setState({
          groupCreatedFlag: false,
          groupDescriptionMsg: "Creation Error. Call Baanda Support.",
          groupDescriptionErrFlag: true
        });
      }
    }
  };

  handleEditGroup = async () => {
    // alert("handling edit group");
    let validate = await this.validateNewGroup();
    // console.log("handleEditGroup validate:", validate);
    if (validate) {
      let data = {
        baandaId: this.props.auth.user.baandaId,
        communityId: this.props.communityid,
        groupName: this.state.groupName,
        groupDescription: this.state.groupDescription,
        groupId: this.state.groupId
      };

      let url = baandaServer + updateGroupAPI;
      // console.log("handleEditGroup data:", data, " url:", url);

      try {
        await axios.post(url, data);
        // let grpUpdt = await axios.post(url, data);
        // console.log("grpUpdt:", grpUpdt);
      } catch (err) {
        console.log("handleEditGroup updateGroupAPI error:", err.message);
      }
    }
  };

  validateNewGroup = async () => {
    let isValid = true;

    if (this.state.groupName.length < 5) {
      await this.setState({
        groupNameMsg: "Group name too short. Min 5 chars.",
        groupNameErrFlag: true
      });
      isValid = false;
    } else {
      await this.setState({
        groupNameMsg: "A unique group name (5-to-50 chars)",
        groupNameErrFlag: false
      });
    }

    if (this.state.groupDescription.length < 25) {
      await this.setState({
        groupDescriptionMsg: "Description is too short. Min 25 chars.",
        groupDescriptionErrFlag: true
      });
      isValid = false;
    } else {
      await this.setState({
        groupDescriptionMsg: "Enter a description for the group (25-250 chrs)",
        groupDescriptionErrFlag: false
      });
    }

    // console.log("??? validateNewGroup isValid:", isValid);
    if (isValid) {
      let params =
        "communityId=" +
        this.props.communityid +
        "&groupName=" +
        this.state.groupName +
        "&groupId=" +
        this.state.groupId;
      let url = baandaServer + ifGroupExistsAPI + params;
      // console.log("VallidateNewGroup url:" + url);
      try {
        let ret = await axios.get(url);
        // console.log("if group exists ret:", ret);
        if (ret.data.status === "Error") {
          await this.setState({
            createGroupMsg: "Group name exisits. Click Edit to modify.",
            createGroupMsgErrFlag: true
          });

          isValid = false;
        } else {
          await this.setState({
            createGroupMsg: "Create a new group.",
            createGroupMsgErrFlag: false
          });
        }
      } catch (err) {
        console.log("IfGroupExisit Error:", err.message);
      }
    }

    return isValid;
  };

  handleSaveMember = async () => {
    let emailValid = EmailValidator.validate(this.state.email);
    if (!emailValid) {
      await this.setState({
        emailErrFlag: true
      });
    } else {
      await this.setState({
        emailErrFlag: false
      });
    }

    let member = {
      baandaId: 0,
      email: this.state.email,
      cell: this.state.cell,
      memberName: this.state.memberName,
      role: "Member"
    };
    let data = {
      communityId: this.props.communityid,
      groupId: this.state.groupId,
      requestType: "AddSelectMembers",
      member: member,
      ascDsc: "dsc"
    };
    console.log("handleSaveMember data:", data);
    await this.addSelectMemberList(data);
    // console.log("handleSaveMember data:", data);
    // let addMember = await this.addSelectMemberList(data);
    // console.log(">>>>> addMember:", addMember);
  };

  // Selects the member list at the begining of Member add.
  addSelectMemberList = async data => {
    // alert("addSelectMemberList start");
    let ifExists = true;
    let url = baandaServer + saveGetGroupMembers;
    console.log(">>> addSelectMemberList:", url, " input data:", data);

    let newMembers = await axios.post(url, data);

    // There will minimum one member. We need to handle other error conditions
    // here (when we get sanity in our development process).
    console.log("############## newMembers data:", newMembers.data);
    if (newMembers.data.length > 0) {
      await this.setState({
        selectedMembers: newMembers.data,
        memberName: "",
        email: "",
        cell: ""
      });
      if (this.state.createGroupFlag) {
        await this.setState({
          newMemberPanelFlag: true,
          editMemberListFlag: false
        });
      }
      if (this.state.editGroupFlag) {
        await this.setState({
          newMemberPanelFlag: false,
          editMemberListFlag: true
        });
      }
    } else {
      ifExists = false;
    }
    // console.log("new Member:", newMembers);
    return ifExists;
  };

  handleFind = async () => {
    // alert("handling find");
    // let ifExists = true;
    // Remove  create or edit group name/description panel.
    await this.setState({
      showgroupEditPanelFlag: false,
      createGroupFlag: false,
      editMemberListFlag: false,
      editMemberPanelFlag: false
    });
    let params =
      "communityId=" +
      this.props.communityid +
      "&communityName=" +
      this.props.commName +
      "&groupName=" +
      this.state.searchGroupName;
    let url = baandaServer + getGroupsOfCommunity + params;
    console.log("handleFind url:", url);
    try {
      let ret = await axios.get(url);
      // console.log('ret: ', ret);
      let sortRet =ret.data.Msg.sort((a,b) => ( a.groupName.toLowerCase() > b.groupName.toLowerCase()) ? 1 : -1);
      console.log('sortRet:', sortRet);
      if (ret.data.status === "Error") {
        throw new Error(ret.data.Msg);
      } else {
        if (ret.data.Msg.length === 0) {
          await this.setState({
            groupsSelectedErrFlag: true,
            groupsSelectedMsg: ret.Msg,
            groupSelectedToEditFlag: false // Nothing to edit hence don't show the groups panel
          });
        } else {
          let groupOption = {};
          groupOptions = [];
          ret.data.Msg.forEach(obj => {
            groupOption = {
              value: obj.groupId,
              label: obj
            };
            groupOptions.push(groupOption);
          });
          // console.log('%%%%%% ret.data.length:', ret.data.length, ' groupOptions:', groupOptions);
          if (groupOptions.length === 1) {
            // there is only one and hence prepGroupForEdit.

            // console.log("I m here 1: ");
            await this.setState({
              groups: groupOptions,
              groupSelectedToEditFlag: false,
              groupsSelectedErrFlag: false,
              showgroupEditPanelFlag: true,
              groupName: groupOptions[0].label.groupName,
              groupId: groupOptions[0].label.groupId,
              groupDescription: groupOptions[0].label.description,
              editMemberPanelFlag: true
              // editMemberListFlag: true
            });
            // console.log(
            //   "I m here 1: this.state.groups=",
            //   this.state.groups,
            //   " groupOptions=",
            //   groupOptions
            // );
            this.prepGroupToEdit(ret.data.Msg[0]);
          } else {
            await this.setState({
              groups: groupOptions,
              groupSelectedToEditFlag: true,
              groupsSelectedErrFlag: false
              //   editMemberListFlag: true
            });
          }
        }
      }
    } catch (err) {
      console.log("GetGroupsOfCommunity Err:", err.message);
    }
  };

  prepGroupToEdit = async data => {
    // Get members for the community & group with the data below
    let data1 = {
      communityId: this.props.communityid,
      groupId: data.groupId,
      requestType: "SelectMembers",
      member: {},
      ascDsc: "dsc"
    };
    // console.log("prepGroupToEdit data:", data, " data1:", data1);
    let members = this.addSelectMemberList(data1);
    // Set flag to set member's list with delete 'X' button except for role='Creator'
    await this.setState({
      showMemberEditPanelFlag: true,
      membersToShowDelete: members
    });
  };

  handleGroupSelected = async e => {
    // alert("handleGroupSelected: " + e.target.value);
    // console.log("handleGroupSelected: ", e.target.value);
    let val = JSON.parse(e.target.value);
    let data = {
      communityId: this.props.communityid,
      groupId: val.groupId,
      requestType: "SelectMembers",
      member: {},
      ascDsc: "dsc"
    };
    // console.log(">>> handleGroupSelected data:", data);
    let memberExists = await this.addSelectMemberList(data);
    // console.log("memberExists:", memberExists);
    if (memberExists) {
      await this.setState({
        showgroupEditPanelFlag: true,
        showEditAddNewMemberPanelFlag: false,
        showMemberEditPanelFlag: false,
        groupSelectedToEditFlag: false, // close the grouplist dropdown
        groupName: val.groupName,
        groupId: val.groupId,
        groupNameErrFlag: false,
        groupNameMsg: "Edited name must be unique (5-50 chars).",
        groupDescription: val.description,
        createGroupMsgErrFlag: false,
        createGroupFlag: false,
        editMemberListFlag: true,
        editMemberPanelFlag: true
      });
    } else {
    }
  };

  handleDeleteMember = async email => {
    // console.log('will handle delete members :' + email + ' groupId:', this.state.groupId + ' communityId:' + this.props.communityid);
    let url = baandaServer + deleteGroupMember;
    let data = {
      communityId: this.props.communityid,
      groupId: this.state.groupId,
      email: email,
      ascDsc: "dsc" // Descending ordered. If asc for ascending.
    };
    try {
      let ret = await axios.post(url, data);
      // console.log('ret:', ret)
      await this.setState({
        selectedMembers: ret.data
      });
    } catch (err) {
      console.log("Member Delete Error:", err.message);
    }
  };

  render() {
    console.log("GroupAdmin props:", this.props);
    console.log("GroupAdmin state:", this.state);

    let groupOpsBtn;

    if (this.state.createGroupFlag) {
      groupOpsBtn = (
        <div>
          <button
            className="btn_grouping_create"
            type="button"
            onClick={() => this.handleCreateGroup()}
          >
            <b>Create Group</b>
          </button>
        </div>
      );
    } else if (this.state.showgroupEditPanelFlag) {
      groupOpsBtn = (
        <div>
          <button
            className="btn_grouping_create"
            type="button"
            onClick={() => this.handleEditGroup()}
          >
            <b>Edit Group</b>
          </button>
        </div>
      );
    }

    let groupDefPanel;
    if (this.state.createGroupFlag || this.state.showgroupEditPanelFlag) {
      groupDefPanel = (
        <div>
          <div className="row">
            <div className="col">
              <input
                name="groupName"
                type="text"
                value={this.state.groupName}
                onChange={this.onChange}
                size="50"
                maxLength="50"
                className="input_text_groupname"
                placeholder="Enter a unique group name"
              />
              <div
                className={`${
                  !this.state.groupNameErrFlag
                    ? "group_input_msg"
                    : "group_input_msg_err"
                }`}
              >
                <p>{this.state.groupNameMsg}</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col text-center">
              <textarea
                name="groupDescription"
                maxLength="250"
                placeholder="Write short description of the group."
                rows="4"
                //   cols="50"
                wrap="hard"
                spellCheck="true"
                className="input_textarea_grouping"
                onChange={this.onChange}
                value={this.state.groupDescription}
                required
              />
              <div
                className={`${
                  !this.state.groupDescriptionErrFlag
                    ? "group_input_msg text-center"
                    : "group_input_msg_err text-center"
                }`}
              >
                <p>{this.state.groupDescriptionMsg}</p>
              </div>
            </div>
          </div>
          <div className="row create_button_placement">
            <div className="col-9">
              <div
                className={`${
                  !this.state.createGroupMsgErrFlag
                    ? "group_input_msg text-center"
                    : "group_input_msg_err text-center"
                }`}
              >
                {this.state.createGroupMsg}
              </div>
            </div>
            <div className="col-3 text-left">{groupOpsBtn}</div>
          </div>
          <hr className="adjust" />
        </div>
      );
    }

    let selectGroupdropdown;
    if (this.state.groupSelectedToEditFlag) {
      let selheight = this.state.groups.length;
      // console.log("this.state.groups.length:", selheight);
      if (selheight > 7) selheight = 7;

      let selgrouplist = this.state.groups.map((obj, i) => {
        return (
          <option key={i} value={JSON.stringify(obj.label)}>
            {obj.label.groupName}
          </option>
        );
      });
      // console.log("selgrouplist:", selgrouplist);
      selectGroupdropdown = (
        <div>
          <div className="row select_panel_group">
            <div className="col text-center div_group_select">
              <select
                size={selheight}
                onChange={this.handleGroupSelected}
                className="group-select"
              >
                {selgrouplist}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col text-center select_item_msg">
              Please select a group to edit
            </div>
          </div>
        </div>
      );
    }

    let searchPanel;
    if (this.state.editGroupFlag) {
      searchPanel = (
        <div className="text-center">
          <div className="row searchpanel_placement_group">
            <div className="col-10 search_input_placement">
              <input
                name="searchGroupName"
                type="text"
                value={this.state.searchGroupName}
                onChange={this.onChangeText}
                size="50"
                maxLength="50"
                className="input_text_group"
                placeholder="Group name to search-filter"
              />
              <div
                className={`${
                  !this.state.searchGroupErrFlag
                    ? "group_input_msg"
                    : "group_input_msg_err"
                }`}
              >
                <p>{this.state.searchGroupMsg}</p>
              </div>
            </div>
            <div className="col-2 search_go_btn_placement text-left">
              <button
                className="btn_goFind_groups"
                type="button"
                onClick={this.handleFind}
              >
                <i className="fas fa-search" />
              </button>
              &nbsp;
            </div>
          </div>
          <div>{selectGroupdropdown}</div>
        </div>
      );
    }

    let addMemberPanel;
    if (
      (this.state.groupCreatedFlag && this.state.createGroupFlag) ||
      this.state.editMemberPanelFlag
    ) {
      addMemberPanel = (
        <div>
          <div className="row">
            <div className="col-3">&nbsp;</div>
            <div className="col-6 text-center add-member-header">
              Add Members
            </div>
            <div className="col-3">&nbsp;</div>
          </div>
          <div className="row">
            <div className="col input_members">
              <input
                name="memberName"
                type="text"
                value={this.state.memberName}
                onChange={this.onChangeMemberName}
                size="50"
                maxLength="50"
                className="input_text_groupname"
                placeholder="Enter member's name."
              />
              <div
                className={`${
                  !this.state.memberNameErrFlag
                    ? "group_input_msg"
                    : "group_input_msg_err"
                }`}
              >
                <p>{this.state.memberNameMsg}</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col input_members">
              <input
                name="email"
                type="text"
                value={this.state.email}
                onChange={this.onChange}
                size="50"
                maxLength="50"
                className="input_text_groupname"
                placeholder="Enter member's email."
              />
              <div
                className={`${
                  !this.state.emailErrFlag
                    ? "group_input_msg"
                    : "group_input_msg_err"
                }`}
              >
                <p>{this.state.emailMsg}</p>
              </div>
            </div>
          </div>
          <div className="row cell_placement">
            <div className="col-1">&nbsp;</div>
            <div className="col-8">
              <PhoneInput
                placeholder="Cell number (optional)"
                value={this.state.cell}
                onChange={cell => this.setState({ cell })}
                country="US"
                className="phoneFlag"
              />
            </div>
            <div className="col-3">&nbsp;</div>
          </div>
          <div className="row create_button_placement">
            <div className="col-8">
              <div
                className={`${
                  !this.state.memberMsgErrFlag
                    ? "group_input_msg"
                    : "group_input_msg_err"
                }`}
              >
                {this.state.memberMsg}
              </div>
            </div>
            <div className="col-4 text-center">
              <button
                className="btn_member_add"
                type="button"
                onClick={() => this.handleSaveMember()}
              >
                <b>Save</b>&nbsp;&nbsp;
                <i className="fas fa-plus" />
              </button>
            </div>
          </div>
          <hr className="adjust" />
        </div>
      );
    }

    let groupnavbuttons;
    if (this.state.createGroupFlag) {
      groupnavbuttons = (
        <div>
          <div className="row">
            <div className="col-4 header_grouping_style">Create Group</div>
            <div className="col-8 btn_grouping_placement">
              <button
                className="btn_grouping"
                type="button"
                onClick={() => this.handleEdit()}
              >
                <b>Edit</b>
              </button>
              &nbsp;
              <button
                className="btn_grouping"
                type="button"
                onClick={() => this.handleView()}
              >
                <b>View</b>
              </button>
              &nbsp;
              <button
                className="btn-modal-grouping"
                type="button"
                onClick={this.openAlertModal}
              >
                <i className="fas fa-info-circle" />
              </button>
            </div>
          </div>
        </div>
      );
    } else if (this.state.editGroupFlag) {
      groupnavbuttons = (
        <div>
          <div className="row">
            <div className="col-4 header_grouping_style">Edit Group</div>
            <div className="col-8 btn_grouping_placement">
              <button
                className="btn_grouping"
                type="button"
                onClick={() => this.handleCreate()}
              >
                <b>Create</b>
              </button>
              &nbsp;
              <button
                className="btn_grouping"
                type="button"
                onClick={() => this.handleView()}
              >
                <b>View</b>
              </button>
              &nbsp;
              <button
                className="btn-modal-grouping"
                type="button"
                onClick={this.openAlertModal}
              >
                <i className="fas fa-info-circle" />
              </button>
            </div>
          </div>
        </div>
      );
    } else if (this.state.viewGroupFlag) {
      groupnavbuttons = (
        <div>
          <div className="row">
            <div className="col-4 header_grouping_style">View Groups</div>
            <div className="col-8 btn_grouping_placement">
              <button
                className="btn_grouping"
                type="button"
                onClick={() => this.handleCreate()}
              >
                <b>Create</b>
              </button>
              &nbsp;
              <button
                className="btn_grouping"
                type="button"
                onClick={() => this.handleEdit()}
              >
                <b>Edit</b>
              </button>
              &nbsp;
              <button
                className="btn-modal-grouping"
                type="button"
                onClick={this.openAlertModal}
              >
                <i className="fas fa-info-circle" />
              </button>
            </div>
          </div>
        </div>
      );
    } else if (this.state.inviteFlag) {
      groupnavbuttons = (
        <div>
          <div className="row">
            <div className="col-3 header_grouping_style">Invite</div>
            <div className="col-9 btn_grouping_placement">
              <button
                className="btn_grouping"
                type="button"
                onClick={() => this.handleCreate()}
              >
                <b>Create</b>
              </button>
              &nbsp;
              <button
                className="btn_grouping"
                type="button"
                onClick={() => this.handleEdit()}
              >
                <b>Edit</b>
              </button>
              &nbsp;
              <button
                className="btn_grouping"
                type="button"
                onClick={() => this.handleView()}
              >
                <b>View</b>
              </button>
              &nbsp;
              <button
                className="btn-modal-grouping"
                type="button"
                onClick={this.openAlertModal}
              >
                <i className="fas fa-info-circle" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    let newMemberPanel;
    if (this.state.newMemberPanelFlag) {
      // console.log("this.state.selectedMembers: ", this.state.selectedMembers);
      newMemberPanel = (
        <div>
          <div className="new_member_header text-center">New Group Members</div>
          {this.state.selectedMembers.map((member, i) => (
            <div key={i}>
              <div className="row">
                <div className="col show_new_member text-left">
                  <i className="fas fa-check-circle" /> &nbsp;&nbsp;
                  {member.memberName}&nbsp;({member.role})
                </div>
              </div>
            </div>
          ))}
          <div className="space_below" />
        </div>
      );
    }

    let editMemberPanel;
    if (this.state.editMemberListFlag) {
      //   console.log("this.state.selectedMembers:", this.state.selectedMembers);
      editMemberPanel = (
        <div>
          <div className="row">
            <div className="col-8 new_member_header text-center">
              Present Group Members
            </div>
            <div className="col-4 invite_btn_placement">
              <button
                className="btn_invite"
                type="button"
                onClick={() => this.handleInvite()}
              >
                <b>Invite</b>&nbsp;&nbsp;
                <i className="far fa-envelope" />
              </button>
            </div>
          </div>
          {this.state.selectedMembers.map((member, i) => (
            <div key={i}>
              <div className="row">
                <div className="col show_old_member text-left">
                  {member.role === "Creator" ? (
                    <button
                      className="btn_creator"
                      type="button"
                      //   onClick={() => this.handleCreateGroup()} - show only row
                    >
                      <i className="fab fa-earlybirds" />
                    </button>
                  ) : (
                    <button
                      className="btn_delete_member"
                      type="button"
                      onClick={() => this.handleDeleteMember(`${member.email}`)}
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                  )}
                  &nbsp;&nbsp;
                  <i className="fas fa-check-circle" />
                  &nbsp;
                  {member.memberName}&nbsp;({member.role})
                </div>
              </div>
            </div>
          ))}
          <hr className="adjust" />
          <div className="space_below" />
        </div>
      );
    }

    let outputPanel;

    if (this.state.createGroupFlag) {
      outputPanel = (
        <div>
          {groupDefPanel}
          {addMemberPanel}
          {newMemberPanel}
        </div>
      );
    } else if (this.state.editGroupFlag) {
      outputPanel = (
        <div>
          {searchPanel}
          {groupDefPanel}
          {addMemberPanel}
          {editMemberPanel}
        </div>
      );
    } else if (this.state.editGroupFlag) {
      outputPanel = (
        <div className="text-center">
          <br /> 
          <br />
          <br />
          <h6>Coming soon - in November 2019 Release</h6>
          <br />
          <p align="justify" className="coming_soon">
            This will include group search-filter, group's information, that
            will include description, member list, member participation
            (accepted, declined etc.), and other activity. Baanda team is
            gathering viewing requirements from the users.
          </p>
        </div>
      );
    } else if (this.state.inviteFlag) {
      outputPanel = <div><Invite communityId={this.props.communityid} groupId={this.state.groupId} groupName={this.state.groupName} selectedMembers={this.state.selectedMembers}/></div>;
    }

    return (
      <div className="fixedsize_grouping">
        {groupnavbuttons}
        {outputPanel}
        <ModalContainer />
      </div>
    );
  }
}

GroupAdmin.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  hideModal: () => dispatch(hideModal()),
  showModal: (modalProps, modalType) => {
    dispatch(showModal({ modalProps, modalType }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(GroupAdmin));

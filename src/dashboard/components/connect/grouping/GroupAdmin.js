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

import "./GroupAdmin.css";

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;
const ifGroupExistsAPI = "/routes/dashboard/ifGroupExists?";
const createNewGroupAPI = "/routes/dashboard/createNewGroup";
const saveGetGroupMembers = "/routes/dashboard/saveGetGroupMembers";

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
      createGroupMsg: "Create a new group.",
      createGroupMsgErrFlag: false,

      memberName: "",
      memberNameMsg: "Enter name. (5 - 50 chars)",
      memberNameErrFlag: false,
      email: "",
      emailMsg: "Enter a valid email.",
      emailErrFlag: false,
      cell: "",
      cellMsg: "Enter Cell# (optional).",
      cellErrFlag: false,

      memberMsg: "",
      memberMsgErrFlag: false,
      selectedMembers: null
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

  handleEdit = async () => {
    await this.setState({
      createGroupFlag: false,
      editGroupFlag: true,
      viewGroupFlag: false
    });
  };

  handleCreate = async () => {
    await this.setState({
      createGroupFlag: true,
      editGroupFlag: false,
      viewGroupFlag: false,
      groupCreatedFlag: false
    });
  };

  handleView = async () => {
    await this.setState({
      createGroupFlag: false,
      editGroupFlag: false,
      viewGroupFlag: true
    });
  };

  handleCreateGroup = async () => {
    let validate = await this.validateNewGroup();
    console.log("validate:", validate);
    if (validate) {
      // Call createNewGroup
      let data = {
        baandaId: this.props.auth.user.baandaId,
        communityId: this.props.communityid,
        groupName: this.state.groupName,
        groupDescription: this.state.groupDescription
      };

      console.log("handleCreateGroup data:", data);
      let url = baandaServer + createNewGroupAPI;
      console.log("url: ", url);
      try {
        let ret = await axios.post(url, data);
        console.log("handle create Group ret:", ret);
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
          console.log("handleCreateGroup data:", data);
          let retMember = await this.addSelectMemberList(data);
          console.log("handleCreateGroup retMember:", retMember);
          //   await this.setState({
          //     selectedMembers: retMember
          //   });
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

    if (isValid) {
      let params =
        "communityId=" +
        this.props.communityid +
        "&groupName=" +
        this.state.groupName;
      let url = baandaServer + ifGroupExistsAPI + params;
      try {
        let ret = await axios.get(url);
        console.log("if group exists ret:", ret);
        if (ret.data.status === "Error") {
          await this.setState({
            createGroupMsg: "Group name exisits. Click Edit to modify.",
            createGroupMsgErrFlag: true
          });
          console.log("The group exsits...");
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
        emailMsg: "Enter a valid email.",
        emailErrFlag: true
      });
    } else {
      await this.setState({
        emailMsg: "Enter valid email.",
        emailErrFlag: false
      });
    }

    let member = {
      baandaId: 0,
      email: this.state.email,
      cell: this.state.cell,
      memberName: this.state.memberName,
      role: "Participant"
    };
    let data = {
      communityId: this.props.communityid,
      groupId: this.state.groupId,
      requestType: "AddSelectMembers",
      member: member,
      ascDsc: "dsc"
    };
    console.log("handleSaveMember data:", data);
    let addMember = await this.addSelectMemberList(data);
    console.log("addMember:", addMember);
  };

  // Selects the member list at the begining of Member add.
  addSelectMemberList = async data => {
    let url = baandaServer + saveGetGroupMembers;
    console.log(">>> addSelectMemberList:", url, " input data:", data);

    let newMembers = await axios.post(url, data);
    await this.setState({
      selectedMembers: newMembers.data,
      memberName: "",
      email: "",
      cell: ""
    });
    console.log("new Member:", newMembers);
    return true;
  };

  render() {
    // console.log("GroupAdmin props:", this.props);
    console.log("GroupAdmin state:", this.state);

    let groupDefPanel;
    if (this.state.createGroupFlag) {
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
            <div className="col-3 text-left">
              <button
                className="btn_grouping_create"
                type="button"
                onClick={() => this.handleCreateGroup()}
              >
                <b>Create Group</b>
              </button>
            </div>
          </div>
          <hr className="adjust" />
          {/* <hr /> */}
        </div>
      );
    }

    let addMemberPanel;
    if (this.state.groupCreatedFlag && this.state.createGroupFlag) {
      addMemberPanel = (
        <div>
          <div className="row">
            <div className="col-4">&nbsp;</div>
            <div className="col-4 text-center add-member-header">
              Add Members
            </div>
            <div className="col-4">&nbsp;</div>
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

    let catalogbuttons;
    if (this.state.createGroupFlag) {
      catalogbuttons = (
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
      catalogbuttons = (
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
    } else {
      catalogbuttons = (
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
    }

    let newMemberPanel;

    if (this.state.selectedMembers && this.state.selectedMembers.length > 0) {
      newMemberPanel = (
        <div>
          <div className="new_member_header text-center">New Group Members</div>  
          {this.state.selectedMembers.map((member, i) => (
            <div key={i}>
              <div className="row">
                <div className="col show_new_member text-left">
                <i className="fas fa-check-circle" /> &nbsp;&nbsp;
                {member.memberName}&nbsp;({member.role})</div>
              </div>
            </div>
          ))}
          <hr className="adjust" />
          <div className="space_below" />
        </div>
      );
    }

    let outputPanel;

    outputPanel = (
      <div>
        {groupDefPanel}
        {addMemberPanel}
        {newMemberPanel}
      </div>
    );

    return (
      <div className="fixedsize_grouping">
        {catalogbuttons}
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
)(withRouter(GroupAdmin));

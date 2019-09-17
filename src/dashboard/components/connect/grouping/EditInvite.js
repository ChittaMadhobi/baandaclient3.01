import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import axios from "axios";
import ReactLoading from "react-loading";

import "./EditInvite.css";
// import herbalpic from '../image/herbpic5.jpg';

const baandaServer = process.env.REACT_APP_BAANDA_SERVER;

const saveInvitesAndSendMails = "/routes/dashboard/saveInvitesAndSendMails";
const saveGetGroupMembers = "/routes/dashboard/saveGetGroupMembers";
const saveInvitesToIndvidual = "/routes/dashboard/saveInvitesToIndvidual";
const getInviteLetterContent = "/routes/dashboard/getInviteLetterContent?";
const saveInviteLetter = '/routes/dashboard/saveInviteLetter';

class EditInvite extends Component {
  constructor(props) {
    super(props);

    this.state = {
      salute: "Dear",
      saluteMsg: "Salute",
      saluteErrFlag: false,

      subject: "Invitation to join the group <" + this.props.groupName + ">",
      inviteBody:
        "This system (Baanda) will process your operational information upon your consent. I am inviting you to join the group so we can handle operation. When you register in the Baanda system using the same email, you will be able to view, ask, provide multi-dimensional feedback and much more so Baanda can provide individualized services.\r\n \r\nNote: You are not required to register in Baanda now. Upon consent, you will be taken to baanda web-site if you are interested to know more.",
      acceptLinkMsg: "Please click the picture below to accept the invitation.",
      signature: "Creator Name \r\nCommunity & Group Creator",
      revImgSrc: "https://baandadev1.s3-us-west-2.amazonaws.com/herbpic5.jpg",
      saveLetterMsg: '',

      memberListFlag: true,

      prepFlag: true,
      reviewFlag: false,
      selectedMembers: [],
      loadingFlag: false,
      loadedMsg: "",
      lodedFlag: false
    };
  }

  componentWillMount = async () => {
    // await this.setState({
    //   selectedMembers: this.props.selectedMembers
    // });
    let datam = {
      communityId: this.props.communityId,
      groupId: this.props.groupId,
      requestType: "selectMembers",
      member: [],
      ascDsc: "dsc"
    };
    let urlm = baandaServer + saveGetGroupMembers;
    let ivtLetterParms =
      "communityId=" +
      this.props.communityId +
      "&groupId=" +
      this.props.groupId;
    let urlLetter = baandaServer + getInviteLetterContent + ivtLetterParms;
    try {
      let newMembers = await axios.post(urlm, datam);
      // console.log('newMember:', newMembers);
      let il = await axios.get(urlLetter);
      // console.log("il:", il);
      let invLet = il.data.Msg[0].inviteLetter;
      if (invLet.body !== "") {
        // console.log("got something in invite letter");
        await this.setState({
          selectedMembers: newMembers.data,
          salute: invLet.salute,
          subject: invLet.subject,
          inviteBody: invLet.body,
          acceptLinkMsg: invLet.acceptLink,
          signature: invLet.signature
        });
      } else {
        // console.log("inviteletter in DB is empty");
        await this.setState({
          selectedMembers: newMembers.data
        });
      }
    } catch (err) {
      console.log("EditInvite componentWillMount Error:", err.message);
    }
  };

  onChange = async e => {
    await this.setState({ 
      [e.target.name]: e.target.value,
      saveLetterMsg: '' 
    });
  };

  handlePrep = async () => {
    await this.setState({
      prepFlag: true,
      reviewFlag: false
    });
  };

  handlePrepReview = async () => {
    await this.setState({
      prepFlag: false,
      reviewFlag: true
    });
  };

  handlePrepSave = async () => {
    // alert("handlePrepSave");
    // COMPLETE THIS FIRST ... Call the damn microservice 
    let url = baandaServer + saveInviteLetter;
    let data = {
      communityId: this.props.communityId,
      groupId: this.props.groupId,
      inviteLetter: {
        subject: this.state.subject,
        salute: this.state.salute,
        body: this.state.inviteBody,
        acceptLink: this.state.acceptLinkMsg,
        signature: this.state.signature
      }
    };
    try { 
      await axios.post(url, data);
      await this.setState({
        saveLetterMsg: 'Saved'
      });
    } catch(err) {
      console.log('handlePrepSave: ', err.message);
      await this.setState({
        saveLetterMsg: 'Failed: Contact Baanda support.'
      });
    }

  };

  handleInviteAll = async () => {
    // alert("handle invite all");
    await this.setState({
      loadingFlag: true
    });
    let url = baandaServer + saveInvitesAndSendMails;
    let data = {
      communityId: this.props.communityId,
      groupId: this.props.groupId,
      inviteLetter: {
        subject: this.state.subject,
        salute: this.state.salute,
        body: this.state.inviteBody,
        acceptLink: this.state.acceptLinkMsg,
        signature: this.state.signature
      }
    };

    // console.log("handleIniviteAll url:", url);
    // console.log("handleInviteAll data:", data);
    try {
      await axios.post(url, data);
      // console.log("handleInviteAll ret: ", ret);
      await this.setState({
        loadingFlag: false,
        loadedMsg: "refresh"
      });
      // console.log('this.state.selectedMembers: ', this.state.selectedMembers);
    } catch (err) {
      console.log("handleInviteAll error: ", err.message);
      await this.setState({
        loadingFlag: false,
        loadedMsg: "Error"
      });
    }
  };

  refreshMembers = async () => {
    await this.setState({
      loadingFlag: true
    });
    let datam = {
      communityId: this.props.communityId,
      groupId: this.props.groupId,
      requestType: "selectMembers",
      member: [],
      ascDsc: "dsc"
    };
    let urlm = baandaServer + saveGetGroupMembers;
    // console.log('urlm:', urlm, ' datam:', datam);
    let newMembers = await axios.post(urlm, datam);
    // console.log('newMembers.data:', newMembers.data);
    await this.setState({
      selectedMembers: newMembers.data,
      loadingFlag: false
    });
    await this.setState({
      loadingFlag: false,
      loadedMsg: "Refreshed"
    });
  };

  handleInviteMember = async (email, name) => {
    // alert("handleIniveiteMember: " + email + ' name:' + name);
    let data = {
      communityId: this.props.communityId,
      groupId: this.props.groupId,
      inviteLetter: {
        subject: this.state.subject,
        salute: this.state.salute,
        body: this.state.inviteBody,
        acceptLink: this.state.acceptLinkMsg,
        signature: this.state.signature
      },
      email: email,
      memberName: name
    };
    let url = baandaServer + saveInvitesToIndvidual;
    try {
      await axios.post(url, data);
      await this.setState({
        loadingFlag: false,
        loadedMsg: "refresh"
      });
    } catch (err) {
      console.log("HandleInviteMember Error:", err.message);
    }
  };

  render() {
    // console.log("props:", this.props);
    // console.log("state:", this.state);

    let inviteButtonPanel;

    if (this.state.prepFlag) {
      inviteButtonPanel = (
        <div>
          <div className="row">
            <div className="col-8 text-right save_letter_msg">{this.state.saveLetterMsg}</div>
            <div className="col-4 btn_invite_placement text-right">
              <button
                className="btn_invite_fn"
                type="button"
                onClick={() => this.handlePrepReview()}
              >
                <b>Review</b>
              </button>
              &nbsp;
              <button
                className="btn_invite_fn"
                type="button"
                onClick={() => this.handlePrepSave()}
              >
                <b>Save</b>
              </button>
            </div>
          </div>
        </div>
      );
    } else if (this.state.reviewFlag) {
      inviteButtonPanel = (
        <div>
          <div className="row">
            <div className="col-8 text-right save_letter_msg">{this.state.saveLetterMsg}</div>
            <div className="col-4 btn_invite_placement text-right">
              <button
                className="btn_invite_fn"
                type="button"
                onClick={() => this.handlePrep()}
              >
                <b>Prep</b>
              </button>
              &nbsp;
              <button
                className="btn_invite_fn"
                type="button"
                onClick={() => this.handlePrepSave()}
              >
                <b>Save</b>
              </button>
            </div>
          </div>
        </div>
      );
    }

    let loadingPanel;
    if (this.state.loadingFlag) {
      loadingPanel = (
        <div>
          <ReactLoading
            type={"spokes"}
            color={"#195670"}
            height={30}
            width={30}
          />
        </div>
      );
    } else {
      loadingPanel = <div>{this.state.loadedMsg}</div>;
    }

    let reviewPanel;
    if (this.state.reviewFlag) {
      reviewPanel = (
        <div>
          <div className="row">
            <div className="col-1">&nbsp;</div>
            <div className="col-4 header_invite_style">Review Invite</div>
            <div className="col-7">&nbsp;</div>
          </div>
          <div className="row">
            <div className="col text-left review_placement">
              <b>Subject:</b>&nbsp;{this.state.subject}
            </div>
          </div>
          <div className="line_spacing" />
          <div className="row">
            <div className="col text-left review_placement">
              {this.state.salute}&nbsp;&nbsp;[[Recipiant's Name]],
            </div>
          </div>
          <div className="line_spacing" />
          <div className="row">
            <div className="col text-left review_placement">
              <p>{this.state.inviteBody}</p>
            </div>
          </div>
          <div className="line_spacing" />
          <div className="row">
            <div className="col text-left review_placement">
              <u>{this.state.acceptLinkMsg}</u>
            </div>
          </div>
          <div className="row">
            <div className="col text-left">
              <img
                alt="review"
                className="letter_review_pic"
                src={this.state.revImgSrc}
              />
            </div>
          </div>
          <div className="line_spacing" />
          <div className="row ">
            <div className="col text-left review_placement">
              <pre>{this.state.signature}</pre>
            </div>
          </div>
          <div className="line_spacing" />
          {inviteButtonPanel}
          <hr className="divider" />
          <div className="line_spacing" />
        </div>
      );
    }

    let prepPanel;
    if (this.state.prepFlag) {
      prepPanel = (
        <div>
          <div className="row">
            <div className="col-1">&nbsp;</div>
            <div className="col-3 header_invite_style">Invite Prep</div>
            <div className="col-8">&nbsp;</div>
          </div>
          <div className="line_spacing" />
          <div className="row">
            <div className="col text-left salute_placement">
              <b>Subject:&nbsp;</b>
              <input
                name="subject"
                type="text"
                value={this.state.subject}
                onChange={this.onChange}
                size="50"
                maxLength="50"
                className="input_subject"
                placeholder="Invite Subject."
              />
            </div>
          </div>
          <div className="line_spacing" />
          <div className="line_spacing" />
          <div className="row">
            <div className="col text-left salute_placement">
              <input
                name="salute"
                type="text"
                value={this.state.salute}
                onChange={this.onChange}
                size="50"
                maxLength="50"
                className="input_salute"
                placeholder="Salute"
              />
              &nbsp;&nbsp;[[Recipiant's Name]],
            </div>
          </div>
          <div className="line_spacing" />
          <div className="row">
            <div className="col">
              <textarea
                name="inviteBody"
                maxLength="1000"
                placeholder="Write short description of the item."
                rows="6"
                wrap="hard"
                spellCheck="true"
                className="input_textarea_body"
                onChange={this.onChange}
                value={this.state.inviteBody}
                required
              />
              {/* <div className="text-center invite_msg">
                <small>Max 2000 chars.</small>
              </div> */}
            </div>
          </div>
          <div className="line_spacing" />
          <div className="row">
            <div className="col text-left salute_placement">
              <input
                name="acceptLinkMsg"
                type="text"
                value={this.state.acceptLinkMsg}
                onChange={this.onChange}
                size="50"
                maxLength="50"
                className="input_acceptLink"
                placeholder="Salute"
              />
              &nbsp;&nbsp;
            </div>
          </div>
          <div className="line_spacing" />
          <div className="row">
            <div className="col">
              <textarea
                name="signature"
                maxLength="1000"
                placeholder="Your signature please."
                rows="4"
                wrap="hard"
                spellCheck="true"
                className="input_signature_body"
                onChange={this.onChange}
                value={this.state.signature}
                required
              />
              {/* <div className="text-center invite_msg">
                <small>Max 500 chars.</small>
              </div> */}
            </div>
          </div>
          {inviteButtonPanel}
          <hr className="divider" />
        </div>
      );
    }

    let listMemberPanel;
    if (this.state.memberListFlag) {
      //   console.log("this.state.selectedMembers:", this.state.selectedMembers);
      listMemberPanel = (
        <div>
          <div className="row">
            <div className="col-6 member_list_header text-center">
              Members To Invite
            </div>
            <div className="col-2 loading_style">{loadingPanel}</div>
            <div className="col-4 invite_btn_placement">
              <button
                className="btn_invite_all"
                type="button"
                onClick={() => this.handleInviteAll()}
              >
                <b>Invite All</b>&nbsp;&nbsp;
                {/* <i className="far fa-envelope" /> */}
              </button>
              &nbsp;
              <button
                className="btn_refresh"
                type="button"
                onClick={() => this.refreshMembers()}
              >
                <i className="fas fa-sync-alt" />
              </button>
            </div>
          </div>
          {this.state.selectedMembers.map((member, i) => (
            <div key={i}>
              <div className="row">
                <div className="col show_members_to_invite text-left">
                  {member.role === "Creator" ? (
                    <button className="btn_creator" type="button">
                      <i className="fab fa-earlybirds" />
                    </button>
                  ) : (
                    <button
                      className="btn_send_invite"
                      type="button"
                      onClick={() =>
                        this.handleInviteMember(
                          `${member.email}`,
                          `${member.memberName}`
                        )
                      }
                    >
                      <i className="fab fa-angellist" />
                    </button>
                  )}
                  &nbsp;&nbsp;
                  <i className="fas fa-check-circle" />
                  &nbsp;
                  {member.memberName}&nbsp;
                  {member.inviteSent ? (
                    <button
                      className="btn_invited"
                      type="button"
                      // onClick={() => this.handleInviteMember(`${member.email}`)}
                    >
                      In&nbsp;
                      <i className="fas fa-thumbs-up" />
                    </button>
                  ) : (
                    <button
                      className="btn_invited"
                      type="button"
                      // onClick={() => this.handleInviteMember(`${member.email}`)}
                    >
                      In&nbsp;
                      <i className="fas fa-thumbs-down" />
                    </button>
                  )}
                  &nbsp;
                  {member.response === "Accepted" ? (
                    <button
                      className="btn_respond"
                      type="button"
                      // onClick={() => this.handleInviteMember(`${member.email}`)}
                    >
                      Rs&nbsp;
                      <i className="fas fa-thumbs-up" />
                    </button>
                  ) : member.response === "Declined" ? (
                    <button
                      className="btn_respond"
                      type="button"
                      // onClick={() => this.handleInviteMember(`${member.email}`)}
                    >
                      Rs&nbsp;
                      <i className="fas fa-thumbs-down" />
                    </button>
                  ) : (
                    <button
                      className="btn_respond"
                      type="button"
                      // onClick={() => this.handleInviteMember(`${member.email}`)}
                    >
                      Res&nbsp;
                      <i className="fab fa-creative-commons-nd" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <hr className="divider" />
          <p align="center" className="invite_msg">
            Click Left button to invitie individuals
          </p>
          <div className="inv_line_spacing" />
        </div>
      );
    }

    let outPanel;
    if (this.state.prepFlag) {
      outPanel = prepPanel;
    } else if (this.state.reviewFlag) {
      outPanel = reviewPanel;
    }

    return (
      <div className="fixedsize_invite">
        {/* <div> */}
        {outPanel}
        {listMemberPanel}
      </div>
    );
  }
}

EditInvite.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(withRouter(EditInvite));

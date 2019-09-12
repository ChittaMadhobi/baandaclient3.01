import React, { Component } from "react";

import "./PosReview.css";

class PosReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullPayFlag: false,
      partPayFlag: false,
      installmentFlag: false,

      isError: false,
      ValidationMsg: ''
    };
  }

  componentWillMount = async () => {
    console.log(
      "this.props.posState.payByDate.format('L'):",
      this.props.posState.payByDate.format("L")
    );
  };

  componentDidMount = () => {
    this.validate();
  };

  validate = async () => {
    if ( this.props.posState.paySchedule.value === 'installment') {
      if ( this.props.posState.noOfInstallment === 0) {
        await this.setState({
          isError: true,
          ValidationMsg: 'Error: Go Back to set the installment payments properly.'
        });
      }
    }
  };

  handleProceed = () => {
    console.log("handleProceed:");
    this.props.manageCustomer();
  };

  handleGoBack = () => {
    console.log("handleGoBack ..");
    this.props.returnToPos();
  };
  render() {
    // console.log("PosReview.js props:", this.props);

    let installmentSpec;
    if (
      this.props.posState.installmentType.value === "monthly" ||
      this.props.posState.installmentType.value === "bi-monthly"
    ) {
      installmentSpec = (
        <div>
          <div className="row">
            <div className="col-4 text-right label_format">By :&nbsp;</div>
            <div className="col-8 text-left data_format">
              {this.props.posState.installmentDateOfMonth}&nbsp;(Day of the
              month)
            </div>
          </div>
        </div>
      );
    } else if (
      this.props.posState.installmentType.value === "weekly" ||
      this.props.posState.installmentType.value === "bi-weekly"
    ) {
      installmentSpec = (
        <div>
          <div className="row">
            <div className="col-4 text-right label_format">By :&nbsp;</div>
            <div className="col-8 text-left data_format">
              {this.props.posState.installmentDayOfWeek.label}&nbsp;(Day of the
              week)
            </div>
          </div>
        </div>
      );
    }

    let payProcessPanel = null;
    if (this.props.posState.paySchedule.value === "fullpay") {
      payProcessPanel = (
        <div>
          <div className="row">
            <div className="col-4 text-right label_format">Message:&nbsp;</div>
            <div className="col-8 text-left data_format">
              Proceed to complete the transaction.
            </div>
          </div>
        </div>
      );
    }
    if (this.props.posState.paySchedule.value === "partpay") {
      payProcessPanel = (
        <div>
          <div className="row">
            <div className="col-4 text-right label_format">Amt Now:&nbsp;</div>
            <div className="col-8 text-left data_format">
              {/* {Number.parseFloat(this.props.posState.amountPaid).toFixed(2)} */}
              $&nbsp;{this.props.posState.amountPaid}
              
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right label_format">Amt IOU:&nbsp;</div>
            <div className="col-8 text-left data_format">
              $&nbsp;{Number.parseFloat(this.props.posState.amountPending).toFixed(2)}
              
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right label_format">Pay by:&nbsp;</div>
            <div className="col-8 text-left data_format">
              {this.props.posState.payByDate.format("L")}
              &nbsp;
            </div>
          </div>
        </div>
      );
    }
    if (this.props.posState.paySchedule.value === "installment") {
      payProcessPanel = (
        <div>
          <div className="row">
            <div className="col-4 text-right label_format">Amt Now:&nbsp;</div>
            <div className="col-8 text-left data_format">
              {/* {Number.parseFloat(this.props.posState.amountPaid).toFixed(2)} */}
              $&nbsp;{this.props.posState.amountPaid}
              
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right label_format">Pay in:&nbsp;</div>
            <div className="col-8 text-left data_format">
              {this.props.posState.noOfInstallment}&nbsp;installments. &nbsp;
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right label_format">Amount:&nbsp;</div>
            <div className="col-8 text-left data_format">
              $&nbsp;{Number.parseFloat(
                this.props.posState.amountPerIstallment
              ).toFixed(2)}
              &nbsp;per payment.
            </div>
          </div>
          <div className="row">
            <div className="col-4 text-right label_format">Interval:&nbsp;</div>
            <div className="col-8 text-left data_format">
              {this.props.posState.installmentType.label}
              &nbsp;
            </div>
          </div>
          {installmentSpec}
        </div>
      );
    }

    let reviewButtons;
    if (!this.state.isError) {
      reviewButtons = (
        <div>
          <div className="row">
            <div className="col-4">{this.state.reviewMsg}</div>
            <div className="col-8 review_btn_placement">
              <button
                className="btn_go_back"
                type="button"
                onClick={this.handleGoBack}
              >
                Go Back&nbsp;
                <i className="fas fa-shopping-cart" />
              </button>
              &nbsp;&nbsp;
              <button
                className="btn_proceed"
                type="button"
                onClick={this.handleProceed}
              >
                Proceed&nbsp;
                <i className="far fa-handshake" />
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      reviewButtons = (
        <div>
          <div className="row">
            <div className="col-4">{this.state.reviewMsg}</div>
            <div className="col-8 review_btn_placement">
              <button
                className="btn_go_back"
                type="button"
                onClick={this.handleGoBack}
              >
                Go Back&nbsp;
                <i className="fas fa-shopping-cart" />
              </button>
              &nbsp;&nbsp;
              {/* <button
                className="btn_proceed_err"
                type="button"
                // onClick={this.handleProceed}
              >
                Proceed&nbsp;
                <i className="far fa-handshake" />
              </button> */}
            </div>
          </div>
        </div>
      );
    }

    let paySchedulePanel = (
      <div>
        <div className="row">
          <div className="col text-center review_header">
            Review & Finalize Transaction
          </div>
        </div>
        <div className="review_spacing" />
        <div className="row">
          <div className="col-4 text-right label_format">
            Pay Process:&nbsp;
          </div>
          <div className="col-8 text-left data_format">
            {this.props.posState.paySchedule.label}
          </div>
        </div>
        <div className="row">
          <div className="col-4 text-right label_format">Tr. Type:&nbsp;</div>
          <div className="col-8 text-left data_format">
            {this.props.posState.payMedium.label}
          </div>
        </div>
        <hr className="review_divide_line" />
        <div className="row">
          <div className="col-4 text-right label_format">Total Amount:&nbsp;</div>
          <div className="col-8 text-left data_format">
            {parseFloat(this.props.posState.totalcost).toFixed(2)}&nbsp;$
          </div>
        </div>
        <div className="row">
          <div className="col-4 text-right label_format">Discount:&nbsp;</div>
          <div className="col-8 text-left data_format">
            $&nbsp;{parseFloat(this.props.posState.toPayDiscount).toFixed(2)}
            
          </div>
        </div>
        <div className="row">
          <div className="col-4 text-right label_format">Tax:&nbsp;</div>
          <div className="col-8 text-left data_format">
            $&nbsp;{parseFloat(this.props.posState.toPayTax).toFixed(2)}
          </div>
        </div>
        <div className="row">
          <div className="col-4 text-right label_format">To be paid:&nbsp;</div>
          <div className="col-8 text-left data_format">
            $&nbsp;{parseFloat(this.props.posState.toPayTotal).toFixed(2)}
            
          </div>
        </div>
        <hr className="review_divide_line" />
        {payProcessPanel}
        {reviewButtons}
        <hr className="review_divide_line" />
        <div className="row">
          <div className="col text-center validation_msg">
            {this.state.ValidationMsg}
          </div>
        </div>
      </div>
    );

    let reviewComposition = paySchedulePanel;
    return <div>{reviewComposition}</div>;
  }
}

export default PosReview;

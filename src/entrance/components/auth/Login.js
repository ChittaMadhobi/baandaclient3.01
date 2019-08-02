import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import classnames from 'classnames';
//import { Link } from 'react-router-dom';
// import { loginUser, googleLoginUser } from '../../../actions/authActions';
import { loginUser } from '../../../actions/authActions';
import './Login.css';
 
class Login extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      email: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    // console.log('In login -- component did mount');
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/lobby');
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('In login -- component will receive props');
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/lobby');
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault(); // In form, we do not want to have default functions
    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    // console.log(user);
    this.props.loginUser(userData);
  }

  onClickGoogle(e) {
    e.preventDefault();
    // console.log('Got into Google Auth onclick function');
    this.props.googleLoginUser();
  }

  render() {
    const { errors } = this.props;
    // console.log('Login js Errors:', this.props.history.location.search);

    return (
      <div className="login">
        <p className="top-padding" />
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">Sign in to Baanda</p>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.email
                    })}
                    placeholder="Email Address"
                    name="email"
                    value={this.email}
                    onChange={this.onChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.password
                    })}
                    placeholder="Password"
                    name="password"
                    value={this.password}
                    onChange={this.onChange}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
              {errors.emailConfirm && (
                <div className="text-danger text-center">
                  <br />
                  {errors.emailConfirm}
                </div>
              )}
              <div className="textspaceTop" />
              <div className="textspaceTop" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  // googleLoginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(connect(
  mapStateToProps,
  { loginUser }
)(Login));


import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  SET_MSG_TRANSFER,
  SET_INITQA_DONE,
  // SET_INITPROFILE_DONE // - intends to use the same as login for jwt token update
} from "./types";
import {
  REGISTER_API_POST,
  LOGIN_API_POST,
  USER_PROFILE_API_POST 
} from "./api";

// stripeKey={process.env.REACT_APP_STRIPE_KEY}
const baandaServer = process.env.REACT_APP_BAANDA_SERVER;

// Register User
export const registerUser = (userData, history) => dispatch => {
  console.log("userData:", userData);
  let url = baandaServer + REGISTER_API_POST;
  console.log("authAction url:", url);
  axios
    .post(url, userData)
    .then(res => {
      // console.log('register res:', res.data);
      dispatch(setMsgTransfer(res.data));
      // return res.data;
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  // console.log('authAction login userData:', userData);
  let url = baandaServer + LOGIN_API_POST; 
  axios
    .post(url, userData)
    .then(res => {
      console.log("Received login response:", res);
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      // console.log("authAction loginUser err:", err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const postUserProfile = profileData => dispatch => {
  // console.log("inside postUserProfile", profileData);
  let url = baandaServer + USER_PROFILE_API_POST; 
  let toUpdateData = {
    baandaid: profileData.user.baandaId,
    profile: profileData.profile
  }
  console.log('url:', url);
  console.log('toUpdateData:', toUpdateData);
  axios
    .post(url, toUpdateData)
    .then(res => {
      console.log("Received login response:", res);
      // Save to localStorage
      const { token } = res.data;
      // // Set token to ls
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // // Decode token to get user data
      const decoded = jwt_decode(token);
      // // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      console.log("authAction postUserProfile err:", err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Set logged in users
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Set message transfer from action to caller via reducer
export const setMsgTransfer = returnMessage => {
  return {
    type: SET_MSG_TRANSFER,
    payload: returnMessage
  };
};

export const setQAInitDone = user => {
  user.isInitDone = true;

  return {
    type: SET_INITQA_DONE,
    payload: user
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove the token from localstorage
  localStorage.removeItem("jwtToken");
  // Remove the auth header for future request
  setAuthToken(false);
  // set thecurrent user to {} which will set isAuthenticated  to fales
  dispatch(setCurrentUser({}));
};

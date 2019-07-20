import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, SET_MSG_TRANSFER } from "./types";
import { REGISTER_API_POST, LOGIN_API_POST } from "./api";

// stripeKey={process.env.REACT_APP_STRIPE_KEY}
const baandaServer = process.env.REACT_APP_BAANDA_SERVER;

// Register User
export const registerUser = (userData, history) => dispatch => {

  console.log("userData:", userData);
  let url = baandaServer + REGISTER_API_POST;
  console.log("API:", url);
  // axios
  //   .post(REGISTER_API_POST, userData)
  //   .then(res => history.push("/login"))
  //   .catch(err =>
  //     dispatch({
  //       type: GET_ERRORS,
  //       payload: err.response.data
  //     })
  //   );
    axios
    .post(REGISTER_API_POST, userData)
    .then(res => {
      console.log('register res:', res.data);
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
  console.log('authAction login userData:', userData);
  axios
    .post(LOGIN_API_POST, userData)
    .then(res => {
      console.log('Received login response:', res)
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
      console.log("authAction loginUser err:", err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
  // axios
  // .post('/api/users/login', userData)
  // .then(res => {
  //   // Save to localStorage
  //   const { token } = res.data;
  //   // Set token to ls
  //   localStorage.setItem('jwtToken', token);
  //   // Set token to Auth header
  //   setAuthToken(token);
  //   // Decode token to get user data
  //   const decoded = jwt_decode(token);
  //   // Set current user
  //   dispatch(setCurrentUser(decoded));
  // })
  // .catch(err =>
  //   dispatch({
  //     type: GET_ERRORS,
  //     payload: err.response.data
  //   })
  // );
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

// Log user out
export const logoutUser = () => dispatch => {
  // Remove the token from localstorage
  localStorage.removeItem("jwtToken");
  // Remove the auth header for future request
  setAuthToken(false);
  // set thecurrent user to {} which will set isAuthenticated  to fales
  dispatch(setCurrentUser({}));
};

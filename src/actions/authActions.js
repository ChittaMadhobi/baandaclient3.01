import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import { REGISTER_API_POST, LOGIN_API_POST } from "./api";

// stripeKey={process.env.REACT_APP_STRIPE_KEY}
const baandaServer = process.env.REACT_APP_BAANDA_SERVER;

// Register User
export const registerUser = (userData, history) => dispatch => {
  // axios
  //   .post('/api/users/register', userData)
  //   .then(res => history.push('/login'))
  //   .catch(err =>
  //     dispatch({
  //       type: GET_ERRORS,
  //       payload: err.response.data
  //     })
  //   );
  console.log("userData:", userData);
  let url = baandaServer + REGISTER_API_POST;
  console.log("API:", url);
  axios
    .post(REGISTER_API_POST, userData)
    .then(res => history.push("/login"))
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

// Log user out
export const logoutUser = () => dispatch => {
  // Remove the token from localstorage
  localStorage.removeItem("jwtToken");
  // Remove the auth header for future request
  setAuthToken(false);
  // set thecurrent user to {} which will set isAuthenticated  to fales
  dispatch(setCurrentUser({}));
};

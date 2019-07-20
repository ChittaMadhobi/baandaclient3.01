import isEmpty from "../utils/isEmpty";

import { SET_CURRENT_USER, SET_MSG_TRANSFER } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case SET_MSG_TRANSFER:
      return {
        user: action.payload
      };
    default:
      return state;
  }
}

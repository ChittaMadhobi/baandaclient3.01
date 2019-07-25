import ActionTypes from '../actions/modalActionTypes';

const initialState = {
  modalType: null,
  modalProps: {}
};

export default (state = initialState, action) => {
  //console.log('modalReducer action:' + JSON.stringify(action));
  switch (action.type) {
    case ActionTypes.SHOW_MODAL:
      return {
        modalProps: action.modalProps,
        modalType: action.modalType,
        type: action.type
      };
    case ActionTypes.HIDE_MODAL:
      return initialState;
    default:
      return state;
  }
};

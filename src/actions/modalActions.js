import ActionTypes from './modalActionTypes';

export const showModal = ({ modalProps, modalType }) => dispatch => {
  dispatch({
    type: ActionTypes.SHOW_MODAL,
    modalProps,
    modalType
  });
};

export const hideModal = modTask => dispatch => {
  // console.log('modTask:' + JSON.stringify(modTask));
  dispatch({
    type: ActionTypes.HIDE_MODAL
  });
};


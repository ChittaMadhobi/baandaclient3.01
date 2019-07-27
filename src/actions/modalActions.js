import ActionTypes from './modalActionTypes';

export const showModal = ({ modalProps, modalType }) => dispatch => {
  // console.log(
  //   '2.actions modalProps:' +
  //     JSON.stringify(modalProps) +
  //     ' modalType:' +
  //     modalType
  // );
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



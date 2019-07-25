// Root Reducer
import { combineReducers } from 'redux';
// import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import modal from './modalReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  modal: modal 
});

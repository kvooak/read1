import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userReducer';
import pageSlice from './pageSlice';

const rootReducer = combineReducers({
  read_exchange_user: userReducer,
  page: pageSlice.reducer,

});

export default rootReducer;

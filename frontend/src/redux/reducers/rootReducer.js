import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userReducer';
import documentSlice from './documentSlice';

const rootReducer = combineReducers({
  read_exchange_user: userReducer,
  document: documentSlice.reducer,
});

export default rootReducer;

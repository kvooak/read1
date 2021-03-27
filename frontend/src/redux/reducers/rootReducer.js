import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  read_exchange_user: userReducer,
});

export default rootReducer;

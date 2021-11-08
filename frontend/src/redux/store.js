import { createStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/rootReducer';

const store = createStore(rootReducer);
export default store;

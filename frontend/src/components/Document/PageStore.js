import React, {
  createContext,
  useReducer,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import store from './functions/store';

export const PageContext = createContext();

export default function PageStore({ children }) {
  const [state, dispatch] = useReducer(...store.storeSeed);
  const useSelector = (callback) => callback(state);

  const contextValue = useMemo(() => ({
    state, dispatch, useSelector,
  }), [state, dispatch, useSelector]);

  return (
    <PageContext.Provider value={contextValue}>
      {children}
    </PageContext.Provider>
  );
}

PageStore.propTypes = {
  children: PropTypes.node.isRequired,
};

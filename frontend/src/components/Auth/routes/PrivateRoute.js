/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const reduxUserValue = useSelector((state) => state.read_exchange_user.value);
  const reduxUserLoading = useSelector((state) => state.read_exchange_user.loading);

  return (
    <Route
      {...rest}
      render={(props) => (
        reduxUserLoading
          ? null
          : reduxUserValue.is_signed_in && reduxUserValue.email_verified
            ? <Component {...props} />
            : <Redirect to="/signin" />
      )}
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default PrivateRoute;

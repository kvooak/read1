/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  // public route: restricted = false
  // restricted route: restricted = true

  const reduxUserValue = useSelector((state) => state.read_exchange_user.value);

  return (
    <Route
      {...rest}
      render={(props) => (
        reduxUserValue.is_signed_in
        && reduxUserValue.email_verified
        && restricted
          ? <Redirect to="/dashboard" />
          : <Component {...props} />
      )}
    />
  );
};

PublicRoute.defaultProps = {
  restricted: false,
};

PublicRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  restricted: PropTypes.bool,
};

export default PublicRoute;

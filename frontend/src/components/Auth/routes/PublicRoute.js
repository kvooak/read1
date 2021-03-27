/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  // public route: restricted = false
  // restricted route: restricted = true

  const currentUser = useSelector((state) => state.read_exchange_user);

  return (
    <Route
      {...rest}
      render={(props) => (
        currentUser.isSignedIn && restricted
          ? <Redirect to="/dashboard" />
          : <Component {...props} />
      )}
    />
  );
};

PublicRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  restricted: PropTypes.bool.isRequired,
};

export default PublicRoute;

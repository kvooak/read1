/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import getUserLoginStatus from '../utils/getUserLoginStatus';

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  // public route: restricted = false
  // restricted route: restricted = true
  const userLoginStatus = getUserLoginStatus();
  console.log(userLoginStatus);
  return (
    <Route
      {...rest}
      render={(props) => (
        userLoginStatus.isSignedIn && restricted
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

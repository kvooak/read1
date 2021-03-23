/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import getUserLoginStatus from '../utils/getUserLoginStatus';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const userLoginStatus = getUserLoginStatus();
  return (
    <Route
      {...rest}
      render={(props) => (
        userLoginStatus.isSignedIn && userLoginStatus.emailVerified
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

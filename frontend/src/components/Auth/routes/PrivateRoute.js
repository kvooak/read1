/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const currentUser = useSelector((state) => state.read_exchange_user);

  return (
    <Route
      {...rest}
      render={(props) => (
        currentUser.isSignedIn && currentUser.emailVerified
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

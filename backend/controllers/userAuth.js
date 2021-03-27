/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const admin = require('firebase-admin');
// const Sentry = require('@sentry/node');
const { isArangoError } = require('arangojs/error');
// const { aql } = require('arangojs');
const print = require('../_utils/print');

const userAuth = async (req, res, next) => {
  print.info('Start authorising user');
  const whiteList = [
    '/api/v1/signup/'
  ];
  const { url, method } = req;
  const { authorization } = req.headers;
  const token = authorization.split(' ')[1];

  if (!token && !whiteList.includes(url)) {
    const tokenError = new Error();
    tokenError.status = 403;
    tokenError.message = `${method} ${url}: Unauthorised due to empty token!`;
    return next(tokenError);
  }

  if (url === 'api/v1/signup') {
    return next();
  }

  let firebaseUser;
  try {
    firebaseUser = await admin.auth().verifyIdToken(token);
    const { email, uid } = firebaseUser;
    // Sentry.setUser({
    //   email,
    //   id: uid,
    // });
  } catch (e) {
    next(e);
    throw e;
  }

  let arangoUser;
  try {
    arangoUser = await req.userCollection.document(firebaseUser.uid);
  } catch (e) {
    if (isArangoError(e)) {
      const arangoErr = new Error();
      arangoErr.status = e.code;
      if (e.code === 404) {
        arangoErr.message = 'User profile not found. Please contact our support staff.';
      } else {
        arangoErr.message = 'There is a change in our database. Please contact our support staff.';
      }
      next(arangoErr);
    } else {
      next(e);
    }
    throw e;
  }

  if (arangoUser.isActive) {
    print.info('Authenticated.');
    print.log({
      username: arangoUser.username,
      uid: arangoUser._key,
      email: arangoUser.email,
      url,
      method,
    });
    req.user = {
      ...arangoUser,
      uid: arangoUser._key,
    };
    return next();
  }

  const inactiveError = new Error();
  inactiveError.status = 403;
  inactiveError.message = 'This user has been disabled!';
  next(inactiveError);
  throw inactiveError;
};

module.exports = userAuth;

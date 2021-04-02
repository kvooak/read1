/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const admin = require('firebase-admin');
// const Sentry = require('@sentry/node');
const { isArangoError } = require('arangojs/error');
// const { aql } = require('arangojs');
const print = require('../_utils/print');

const userAuth = async (req, res, next) => {
  print.info('Start authorising user');
  const { url, method } = req;
  const { authorization } = req.headers;

  if (!authorization) {
    const authorizationHeaderError = new Error();
    authorizationHeaderError.code = 403;
    authorizationHeaderError.message = `${method} ${url}: Unauthorised!`;
    return next(authorizationHeaderError.message);
  }

  print.log(url);

  const whiteList = [
    '/api/v1/users/email-verification/',
    '/api/v1/users/signup/',
  ];

  if (whiteList.includes(url)) {
    return next();
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    req.dbArango = {};
    req.dbPostgres = {};
    const tokenError = new Error();
    tokenError.code = 403;
    tokenError.message = `${method} ${url}: Unauthorised due to empty token!`;
    return next(tokenError);
  }

  let arangoUser;

  admin.auth()  
    .verifyIdToken(token)
    .then(async (decodedToken) => {
      req.users = await req.dbArango.collections('users');
      const { email, uid } = decodedToken;
      // Sentry.setUser({
      //   email,
      //   id: uid,
      // });

      try {
        arangoUser = await req.users.document(uid);
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
    }).
    catch((e) => {
      next(e);
      throw e;
    });

  if (arangoUser.is_active) {
    print.info('Authenticated.');
    print.log({
      id: arangoUser._key,
      email: arangoUser.email,
      is_active: arangoUser.is_active,
      url,
      method,
    });
    req.user = {
      ...arangoUser,
      id: arangoUser._key,
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

/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const admin = require('firebase-admin');
const crypto = require('crypto');
// const Sentry = require('@sentry/node');
const { isArangoError } = require('arangojs/error');
// const { aql } = require('arangojs');

const sendVerificationCodeViaEmail = require('./features/sendVerificationCodeViaEmail');
const print = require('../_utils/print');

exports.createUserProfile = async (req, res, next) => {
  const usersCollection = await req.dbArango.collection('users');
  try {
    const { uid, email } = req.body;
    let newProfile = {
      _key: uid,
      email,
      is_staff: false,
      is_superuser: false,
      is_active: true,
      perms: [],
    }

    const created = await usersCollection.save(newProfile, { returnNew: true });
    success = {
      id: created.new._key,
      email: created.new.email,
    };

    print.info(`User profile ${success.email} created`);
    print.info(`User profile ID ${success.id}`);
    res.status(201).send({ user_profile_created: true });
  } catch (e) {
    next(e);
    throw e;
  }
};


exports.sendEmailVerficicationCode = async (req, res, next) => {
  print.info('Start sending email verification code');
  const { uid } = req.body;
  const randomString = crypto.randomBytes(8).toString('hex');
  const verificationCode = randomString.match(/[\s\S]{1,4}/g).join('-');
  const usersCollection = await req.dbArango.collection('users');

  try {
    await usersCollection.update(
      uid,
      { verification_code: verificationCode },
    );

    print.info(`User ${uid}: Verification code updated ${verificationCode}`);

    const userProfile = await usersCollection.document(uid);
    const { email } = userProfile;
    // await sendVerificationCodeViaEmail(
    //   verificationCode,
    //   email,
    // );

    res.status(201).send({
      sent_verification_code: true,
    });
  } catch (e) {
    next(e);
    throw e;
  }
};

exports.confirmEmailVerficicationCode = async (req, res, next) => {
  print.info('Start confirming email verification code');
  const { uid, verification_code } = req.body;
  const usersCollection = await req.dbArango.collection('users');

  try {
    const userProfile = await usersCollection.document(uid);
    if (verification_code === userProfile.verification_code) {
      admin.auth().updateUser(uid, {emailVerified: true});
      res.status(201).send({
        email_verified: true,
      });
    } else {
      res.status(201).send({
        email_verified: false,
      })
    }
  } catch (e) {
    next(e);
    throw e;
  }
};

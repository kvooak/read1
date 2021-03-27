/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const admin = require('firebase-admin');
// const Sentry = require('@sentry/node');
const { isArangoError } = require('arangojs/error');
// const { aql } = require('arangojs');
const print = require('../_utils/print');
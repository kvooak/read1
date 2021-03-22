const express = require('express');

const app = express();

const port = 8081;

const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./constants/read-exchange-1-firebase-adminsdk-ytboj-a76d1387e1.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});

const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const database = require('./db');
const indexRouter = require('./routes/index');

dotenv.config();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://read.exchange',
    'https://read.exchange',
  ],
  optionsSuccessStatus: 200,
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  // Add PostGre handler
  req.dbPostgres = await database.dbPostgresConnect();

  // Add Arango handler
  req.dbArango = await database.dbArangoConnect();
  next();
});

app.use('/', indexRouter);

app.listen(port, '0.0.0.0');

const express = require('express');
const app = express();
const io = require('./io');
const print = require('./_utils/print');

const http_port = 8081;

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
const userAuth = require('./controllers/userAuth');

dotenv.config();

app.use(cors({
	origin: [
    'http://localhost:3000',
  ],
  optionsSuccessStatus: 200,
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
  req.dbArango = await database.dbArangoConnect();
  next();
});

app.use(userAuth);
app.use('/api/v1', indexRouter);

app.listen(http_port, () => print.log(`http listening on :${http_port}`));
io.server.listen(io.port, () => print.log(`socket.io listening on :${io.port}`));

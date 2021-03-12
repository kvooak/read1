const express = require('express');

const app = express();

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const port = 8081;

const indexRouter = require('./routes/index');

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

app.use('/', indexRouter);

app.listen(port);

const express = require('express');

const userRouter = require('./users');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('-- API --');
});

router.use('/users', userRouter);

module.exports = router;

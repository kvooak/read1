const express = require('express');

const router = express.Router();

const userRouter = require('./users');
const documentRouter = require('./documents');

router.get('/', (req, res) => {
  res.status(200).send('-- API --');
});

router.use('/users', userRouter);
router.use('/documents', documentRouter);

module.exports = router;

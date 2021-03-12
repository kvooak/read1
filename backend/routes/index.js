const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('read.exchange API');
});

module.exports = router;

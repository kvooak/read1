const express = require('express');

const router = express.Router();

const userRouter = require('./users');
const recordController = require('../controllers/recordController');

router.use('/users', userRouter);
router.post('/fetchRecords', recordController.fetchRecords);
router.post('/saveTransactions', recordController.saveTransactions);

module.exports = router;

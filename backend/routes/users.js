const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', userController.createUserProfile);
router.post('/email-verification', userController.sendEmailVerficicationCode);
router.patch('/email-verification', userController.confirmEmailVerficicationCode);

module.exports = router;

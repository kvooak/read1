const express = require('express');

const documentController = require('../controllers/documentController');

const router = express.Router();

router.get('/:id', documentController.getDocument);

module.exports = router;

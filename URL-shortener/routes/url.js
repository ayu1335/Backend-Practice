const express = require('express');
const router = express.Router();
const { createShortURL } = require('../controllers/url');
router.post('/', createShortURL);
module.exports = router;



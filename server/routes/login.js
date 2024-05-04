const express = require('express');
const { login } = require('../controllers/token.js')
const router = express.Router();

router.post('/api/login/', login);
module.exports = router;
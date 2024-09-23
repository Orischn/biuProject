const express = require('express');
const { login, validateUser } = require('../controllers/token.js');
const { getMe } = require('../controllers/user.js');
const router = express.Router();

router.post('/api/login/', login);
router.get('/api/student/', validateUser, getMe)
module.exports = router;
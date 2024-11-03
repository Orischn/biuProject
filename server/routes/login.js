const express = require('express');
const { login, validateUser, refreshAccessToken } = require('../controllers/token.js');
const { getMe, createUser } = require('../controllers/user.js');
const router = express.Router();

router.get('/api/student/', validateUser, getMe);
router.post('/api/Users', createUser);
router.post('/api/login/', login);
router.post('/refresh', refreshAccessToken);
module.exports = router;
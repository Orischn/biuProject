const express = require('express');
const { login, validateUser, refreshAccessToken, logout } = require('../controllers/token.js');
const { getMe, createUser } = require('../controllers/user.js');
const router = express.Router();

router.get('/api/student/', validateUser, getMe);
router.post('/api/Users', createUser);
router.post('/api/login/', login);
router.post('/api/refresh/', refreshAccessToken);
router.post('/api/logout', logout);
module.exports = router;
const express = require('express');
const { login, validateUser } = require('../controllers/token.js');
const { getMe, createUser } = require('../controllers/user.js');
const router = express.Router();

router.get('/api/student/', validateUser, getMe);
router.post('/api/Users', createUser);
router.post('/api/login/', login);
module.exports = router;
const express = require('express');
const { validateUser } = require('../controllers/token');
const { changePassword } = require('../controllers/user');
const router = express.Router();

router.post('/api/changePassword/', validateUser, changePassword);

module.exports = router;
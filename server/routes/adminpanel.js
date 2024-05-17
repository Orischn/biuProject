const express = require('express');
const { uploadTree, checkAdmin } = require('../controllers/adminpanel.js');
const { checkToken } = require("../controllers/token.js");
const { createUser, receiveUser, receiveAllUsers } = require('../controllers/user.js')
const router = express.Router();

router.post('/api/uploadDecisionTree/', checkToken, checkAdmin, uploadTree);
router.get('/api/users/:username', checkToken, checkAdmin, receiveUser);
router.get('/api/users/', checkToken, checkAdmin, receiveAllUsers);
router.post('/api/createUser/',checkToken, checkAdmin, createUser)
module.exports = router;
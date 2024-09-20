const express = require('express');
const { uploadTree, checkAdmin } = require('../controllers/adminpanel.js');
const { validateUser } = require("../controllers/token.js");
const { removeUser, createUser, receiveUser, receiveAllUsers, changePermissions } = require('../controllers/user.js')
const router = express.Router();

router.post('/api/uploadDecisionTree/', validateUser, checkAdmin, uploadTree);
router.get('/api/users/:username', validateUser, checkAdmin, receiveUser);
router.get('/api/users/', validateUser, checkAdmin, receiveAllUsers);
router.post('/api/createUser/',validateUser, checkAdmin, createUser);
router.post('/api/deleteUser/', validateUser, checkAdmin, removeUser);
router.post('/api/changePermissions/', validateUser, checkAdmin, changePermissions)
module.exports = router;

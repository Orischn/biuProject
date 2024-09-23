const express = require('express');
const { uploadTree, checkAdmin } = require('../controllers/adminpanel.js');
const { validateUser } = require("../controllers/token.js");
const { removeUser, createUser, receiveUser, receiveAllStudents, changePermissions } = require('../controllers/user.js');
const { changeGrade, getStudentPractices } = require('../controllers/chatbot.js');
const router = express.Router();

router.post('/api/uploadDecisionTree/', validateUser, checkAdmin, uploadTree);
router.get('/api/getStudent/:userId', validateUser, checkAdmin, receiveUser);
router.get('/api/getStudents/', validateUser, checkAdmin, receiveAllStudents);
router.get('/api/studentPractices/:userId', validateUser, checkAdmin, getStudentPractices)
router.post('/api/createUser/',validateUser, checkAdmin, createUser);
router.post('/api/deleteUser/', validateUser, checkAdmin, removeUser);
router.post('/api/updateGrade', validateUser, checkAdmin, changeGrade)
router.post('/api/changePermissions/', validateUser, checkAdmin, changePermissions)
module.exports = router;

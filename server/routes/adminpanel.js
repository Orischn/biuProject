const express = require('express');
const { checkAdmin, uploadCSVTree, createTask, viewSubmissionStatus, changeGrade, getStudentPractices, createFeedback, updateTask, allowLateSubmit, cancelLateSubmit, viewSubmissionStatusByYear, deleteTask, getStudentTasks, adminGetTasks, uploadValidIdFile } = require('../controllers/adminpanel.js');
const { validateUser } = require("../controllers/token.js");
const { removeUser, createUser, receiveUser, receiveAllStudents, changePermissions } = require('../controllers/user.js');
const router = express.Router();

router.get('/api/getStudent/:userId', validateUser, checkAdmin, receiveUser);
router.get('/api/getStudents/', validateUser, checkAdmin, receiveAllStudents);
router.get('/api/studentPractices/:userId', validateUser, checkAdmin, getStudentPractices);
router.get('/api/adminGetTasks/:year', validateUser, checkAdmin, adminGetTasks);
router.get('/api/getSubmissionStatus/:taskName/:year', validateUser, checkAdmin, viewSubmissionStatus);
router.post('/api/uploadValidIdFile/', validateUser, checkAdmin, uploadValidIdFile)
router.post('/api/createUser/',validateUser, checkAdmin, createUser);
router.post('/api/deleteUser/', validateUser, checkAdmin, removeUser);
router.post('/api/updateGrade/', validateUser, checkAdmin, changeGrade)
router.post('/api/changePermissions/', validateUser, checkAdmin, changePermissions);
router.post('/api/createTask/', validateUser, checkAdmin, createTask);
router.post('/api/updateTask/', validateUser, checkAdmin, updateTask);
router.post('/api/deleteTask/', validateUser, checkAdmin, deleteTask);
router.post('/api/allowLateSubmit/', validateUser, checkAdmin, allowLateSubmit)
router.post('/api/cancelLateSubmit/', validateUser, checkAdmin, cancelLateSubmit)
router.post('/api/createFeedback/', validateUser, checkAdmin, createFeedback)
module.exports = router;

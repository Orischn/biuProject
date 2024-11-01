const express = require('express');
const { validateUser } = require('../controllers/token.js');
const { decipherQuestion, addPractice, recvPractices, recvPractice, finishPractice, viewTasks } = require('../controllers/chatbot.js');
const router = express.Router();

router.get('/api/getPractice/:practiceId', validateUser, recvPractice);
router.get('/api/getPractices/', validateUser, recvPractices);
router.get('/api/getTasks', validateUser, viewTasks);
router.post('/api/addPractice/', validateUser, addPractice);
router.post('/api/finishPractice', validateUser, finishPractice);
router.post('/api/sendMessage/',validateUser, decipherQuestion);
module.exports = router;
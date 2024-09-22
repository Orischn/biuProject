const express = require('express');
const { validateUser } = require('../controllers/token.js')
const { decipherQuestion, answerQuestion, addPractice, recvPractices, recvPractice } = require('../controllers/chatbot.js');
const router = express.Router();

router.get('/api/getPractice/:practiceId', validateUser, recvPractice)
router.get('/api/getPractices/', validateUser, recvPractices)
router.post('/api/addPractice/', validateUser, addPractice)
router.post('/api/sendMessage/',validateUser, decipherQuestion, answerQuestion);
module.exports = router;
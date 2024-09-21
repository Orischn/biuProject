const express = require('express');
const { validateUser } = require('../controllers/token.js')
const { decipherQuestion, answerQuestion, addPractice, getPractices, getPractice } = require('../controllers/chatbot.js');
const router = express.Router();

router.get('/api/getPractice/:practiceID', validateUser, getPractice)
router.get('/api/getPractices/', validateUser, getPractices)
router.post('/api/addPractice/', validateUser, addPractice)
router.post('/api/sendMessage/',validateUser, decipherQuestion, answerQuestion);
module.exports = router;
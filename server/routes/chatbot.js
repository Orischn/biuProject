const express = require('express');
const { validateUser } = require('../controllers/token.js')
const { decipherQuestion, answerQuestion } = require('../controllers/chatbot.js');
const router = express.Router();

router.post('/api/sendMessage/',validateUser, decipherQuestion, answerQuestion);
module.exports = router;
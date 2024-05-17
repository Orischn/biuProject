const express = require('express');
const { checkToken } = require('../controllers/token.js')
const { decipherQuestion, answerQuestion } = require('../controllers/chatbot.js');
const router = express.Router();

router.post('/api/sendMessage/',checkToken, decipherQuestion, answerQuestion);
module.exports = router;
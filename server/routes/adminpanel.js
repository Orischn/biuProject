const express = require('express');
const { uploadTree, checkAdmin } = require('../controllers/adminpanel.js');
const { checkToken } = require("../controllers/token.js");
const router = express.Router();

router.post('/api/uploadDecisionTree/', checkToken, checkAdmin, uploadTree);
module.exports = router;
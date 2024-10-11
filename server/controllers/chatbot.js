<<<<<<< HEAD
const { getTasks } = require("../models/adminPanel");
const { postPractice, getPractice, getPractices, addMessage, getMessages, updateGrade, submitPractice } = require("../models/chatbot");
const { getData } = require("../models/token");
=======
const { postPractice, getPractice, getPractices, addMessage, getMessages, updateGrade, endPractice } = require("../models/chatbot")
const { getData } = require("../models/token")
>>>>>>> 86b2b0881095c00faab2d5de56acd88cd8b6ad2f

const decipherQuestion = async (req, res, next) => {
    const userData = await getData(req.headers.authorization);
    const result = await addMessage(userData.userId, req.body.chatId, req.body.msg, false);
    if (result.status != 200) {
        return res.status(result.status).end(result.error);
    }
    return next();
}

const answerQuestion = async (req, res) => {
    const userData = await getData(req.headers.authorization);
    let result = await getMessages(req.body.chatId, userData.userId);
    return res.status(result.status).json(result.messages[0]);
}

const addPractice = async (req, res) => {
    const userData = await getData(req.headers.authorization);
    const result = await postPractice(userData.userId, req.body.chatId);
    return res.status(result.status).end(result.practice);
}

const recvPractice = async (req, res) => {
    const userData = await getData(req.headers.authorization);
    const result = await getPractice(parseInt(req.params.practiceId), userData.userId);
    return res.status(result.status).end(result.practice);
}

const recvPractices = async (req, res) => {
    const userData = await getData(req.headers.authorization);
    const result = await getPractices(userData.userId);
    return res.status(result.status).end(result.practices);
}

const finishPractice = async (req, res) => {
    const userData = await getData(req.headers.authorization);
    const result = await submitPractice(userData.userId, req.body.chatId);
    return res.status(result.status).end(result.error);
}

const viewTasks = async (req, res) => {
    const result = await getTasks();
    return res.status(result.status).end(result.tasks);
}

module.exports = {
    decipherQuestion,
    answerQuestion,
    addPractice,
    recvPractices,
    recvPractice,
    finishPractice,
    viewTasks,
};
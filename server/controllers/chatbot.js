const { postPractice, getPractice, getPractices, addMessage, getMessages, updateGrade } = require("../models/chatbot")
const { getData } = require("../models/token")

const decipherQuestion = async (req, res, next) => {
    const userData = await getData(req.headers.authorization);
    await addMessage(userData.userId, req.body.chatId, req.body.msg, false)
    return next();
}

const answerQuestion = async (req, res) => {
    const userData = await getData(req.headers.authorization);
    let messages = await getMessages(req.body.chatId, userData.userId);
    return res.status(200).json(messages[0]);
}

const addPractice = async (req, res) => {
    const userData = await getData(req.headers.authorization)
    const practice = await postPractice(userData.userId);
    if (practice === 500) {
        return res.status(practice).end('Internal Server Error');
    } else {
        return res.status(201).end(JSON.stringify(practice));  
    }
}

const recvPractice = async (req, res) => {
    const userData = await getData(req.headers.authorization);
    const practice = await getPractice(parseInt(req.params.practiceId), userData.userId);
    if (practice === 500) {
        return res.status(practice).end('Internal Server Error.');
    } else if (!practice) {
        return res.status(404).end(JSON.stringify(practice));
    } else {
        return res.status(200).end(JSON.stringify(practice));
    }
}

const recvPractices = async (req, res) => {
    const userData = await getData(req.headers.authorization)
    const practices = await getPractices(userData.userId);
    if (practices === 500) {
        return res.status(practices).end('Internal Server Error.');
    } else if (!practices) {
        return res.status(204).end(JSON.stringify(practices));
    } else {
        return res.status(200).end(JSON.stringify(practices));
    }
}

const getStudentPractices = async (req, res) => {
    const practices = await getPractices(req.params.userId);
    if (practices === 500) {
        return res.status(practices).end('Internal Server Error.');
    } else if (!practices) {
        return res.status(204).end(JSON.stringify(practices));
    } else {
        return res.status(200).end(JSON.stringify(practices));
    }
}

const finishPractice = async (req, res) => {
    const userData = await getData(req.headers.authorization)
    const result = await endPractice(userData.userId, req.body.chatId)
    if (practice === 500) {
        return res.status(practice).end('Internal Server Error.');
    } else if (!practice) {
        return res.status(404).end(JSON.stringify(practice));
    } else {
        return res.status(200).end(JSON.stringify(practice));
    }
}

const changeGrade = async (req, res) => {
    console.log(req.body);
    const status = await updateGrade(req.body.userId, req.body.chatId, parseInt(req.body.newGrade));
    if (status === 500) {
        return res.status(status).end('Internal Server Error.');
    } else {
        return res.status(200).end();
    }
}

module.exports = {
    decipherQuestion,
    answerQuestion,
    addPractice,
    recvPractices,
    recvPractice,
    changeGrade,
    getStudentPractices,
    finishPractice,
}

const { postPractice, getPractice, getPractices, addMessage } = require("../models/chatbot")
const { getData } = require("../models/token")

const decipherQuestion = async (req, res, next) => {
    const userData = await getData(req.headers.authorization)
    addMessage(userData.username, req.body.chatId, req.body.msg)
    next();
}

const answerQuestion = async (req, res) => {
    return res.status(200).end(JSON.stringify({'content': 'I Am A Bot', isBot: true}))
}

const addPractice = async (req, res) => {
    const userData = await getData(req.headers.authorization)
    const practice = await postPractice(userData.username);
    if (practice === 500) {
        return res.status(practice).end('Internal Server Error');
    } else {
        return res.status(201).end(JSON.stringify(practice));  
    }
}

const recvPractice = async (req, res) => {
    const userData = await getData(req.headers.authorization)
    const practice = await getPractice(req.header.practiceID, userData.username);
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
    const practices = await getPractices(userData.username);
    if (practices === 500) {
        return res.status(practices).end('Internal Server Error.');
    } else if (!practices) {
        return res.status(404).end(JSON.stringify(practices));
    } else {
        return res.status(200).end(JSON.stringify(practices));
    }
}

module.exports = {
    decipherQuestion,
    answerQuestion,
    addPractice,
    recvPractices,
    recvPractice,
}
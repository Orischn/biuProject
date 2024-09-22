
const { postPractice, getPractice, getPractices, addMessage, getMessages, updateGrade } = require("../models/chatbot")
const { getData } = require("../models/token")

const decipherQuestion = async (req, res, next) => {
    const userData = await getData(req.headers.authorization);
    await addMessage(userData.username, req.body.chatId, req.body.msg, false)
    return next();
}

const answerQuestion = async (req, res) => {
    const userData = await getData(req.headers.authorization);
    let messages = await getMessages(req.body.chatId, userData.username);
    return res.status(200).json(messages[0]);
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
    const userData = await getData(req.headers.authorization);
    const practice = await getPractice(parseInt(req.params.practiceId), userData.username);
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

const changeGrade = async (req, res) => {
    const status = await updateGrade(req.body.userId, req.body.chatId, req.body.newGrade);
    if (status === 500) {
        return res.status(status).end('Internal Server Error.');
    } else {
        return res.status(200);
    }
}

module.exports = {
    decipherQuestion,
    answerQuestion,
    addPractice,
    recvPractices,
    recvPractice,
    changeGrade,
}
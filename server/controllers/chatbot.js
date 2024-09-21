const { postChat, getChats } = require("../models/chatbot")

const decipherQuestion = async (req, res, next) => {

}

const answerQuestion = async (req, res) => {

}

const addPractice = async (req, res) => {
    const userData = getData(req.header.authorization)
    const user = getUser(userData.username)
    const practice = postChat(user);
    if (practice === 500) {
        res.status(practice).end('Internal Server Error');
    } else {
        res.status(201).end(practice);
    }
}

const getPractice = async (req, res) => {
    const userData = getData(req.header.authorization)
    const practices = getChat(req.header.practiceID, userData.username);
    if (practices === 500) {
        res.status(practices).end('Internal Server Error.');
    } else if (!practices) {
        res.status(404).end(practices);
    } else {
        res.status(200).end(practices);
    }
}

const getPractices = async (req, res) => {
    const userData = getData(req.header.authorization)
    const practices = getChats(userData.username);
    if (practices === 500) {
        res.status(practices).end('Internal Server Error.');
    } else if (!practices) {
        res.status(404).end(practices);
    } else {
        res.status(200).end(practices);
    }
}

module.exports = {
    decipherQuestion,
    answerQuestion,
    addPractice,
    getPractices,
    getPractice,
}
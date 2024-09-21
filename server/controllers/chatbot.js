
const { postPractice } = require("../models/chatbot")
const { getData } = require("../models/token")
const { getUser } = require("../models/users")

const decipherQuestion = async (req, res, next) => {

}

const answerQuestion = async (req, res) => {

}

const addPractice = async (req, res) => {
    console.log(req.header.Authorization);
    const userData = getData(req.header.Authorization)
    const practice = postPractice(userData.username);
    if (practice === 500) {
        res.status(practice).end('Internal Server Error');
    } else {
        res.status(201).end(JSON.stringify(practice));  
    }
}

const getPractice = async (req, res) => {
    const userData = getData(req.header.Authorization)
    const practice = getPractice(req.header.practiceID, userData.username);
    if (practice === 500) {
        res.status(practice).end('Internal Server Error.');
    } else if (!practice) {
        res.status(404).end(JSON.stringify(practice));
    } else {
        res.status(200).end(JSON.stringify(practice));
    }
}

const getPractices = async (req, res) => {
    const userData = getData(req.header.Authorization)
    const practices = getPractices(userData.username);
    if (practices === 500) {
        res.status(practices).end('Internal Server Error.');
    } else if (!practices) {
        res.status(404).end(JSON.stringify(practices));
    } else {
        res.status(200).end(JSON.stringify(practices));
    }
}

module.exports = {
    decipherQuestion,
    answerQuestion,
    addPractice,
    getPractices,
    getPractice,
}
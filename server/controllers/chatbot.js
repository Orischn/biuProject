const { getTasks } = require("../models/adminPanel");
const { postPractice, getPractice, getPractices, addMessage, getMessages, submitPractice, botProcesses, getSubmissionData } = require("../models/chatbot");
const { getId } = require("../models/token");
const os = require('os');

const decipherQuestion = async (req, res) => {
    const userId = await getId(req.headers.authorization);
    let result = await addMessage(userId, req.body.chatId, req.body.msg, false);
    if (result.status !== 200) {
        return res.status(result.status).end(result.error);
    }

    botProcesses[req.body.chatId + userId].stdin.write(`${req.body.msg}\n${req.body.chatId}\n${userId}\n`);
    await new Promise((resolve) => {
        setTimeout(resolve, 4000);
    });
    result = await getMessages(req.body.chatId, userId);
    return res.status(result.status).json(result.messages[0]);
}

const addPractice = async (req, res) => {
    const userId = await getId(req.headers.authorization);
    const existingPractice = await getPractice(req.body.chatId, userId);
    if (!existingPractice.practice) {
        const result = await postPractice(userId, req.body.chatId, req.body.durationHours,
            req.body.durationMinutes, req.body.endDate, req.body.year);
        return res.status(result.status).end(JSON.stringify(result.practice));
    }
    return res.status(existingPractice.status).end(JSON.stringify(existingPractice.practice));
}

const recvPractice = async (req, res) => {
    const userId = await getId(req.headers.authorization);
    const result = await getPractice(req.params.practiceId, userId);
    return res.status(result.status).end(JSON.stringify(result.practice));
}

const recvPractices = async (req, res) => {
    const userId = await getId(req.headers.authorization);
    const result = await getPractices(userId);
    return res.status(result.status).end(JSON.stringify(result.practices));
}

const finishPractice = async (req, res) => {
    const userId = await getId(req.headers.authorization);
    const result = await submitPractice(userId, req.body.chatId);
    return res.status(result.status).end(result.error);
}

const viewTasks = async (req, res) => {
    const result = await getTasks(req.params.year);
    return res.status(result.status).end(JSON.stringify(result.tasks));
}

const getUserSubmitData = async (req, res) => {
    const userId = await getId(req.headers.authorization);
    const result = await getSubmissionData(req.params.taskName, userId, req.params.year)
    return res.status(result.status).json(result.submitData).end()
}

module.exports = {
    decipherQuestion,
    addPractice,
    recvPractices,
    recvPractice,
    finishPractice,
    viewTasks,
    getUserSubmitData,
};
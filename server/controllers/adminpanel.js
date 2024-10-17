const { uploadFile, makeTask, getSubmissionStatus, postFeedback, changeTask, takeLateSubmit, giveLateSubmit } = require('../models/adminPanel');
const { getPractices, updateGrade } = require('../models/chatbot');
const { getId } = require('../models/token');
const { getUser, getStudents } = require('../models/users');

const uploadCSVTree = async (req, res) => {
    const result = await uploadFile(req.body.fileName, req.body.CSVTree);
    return res.status(result.status).end(result.error);
}

const createTask = async (req, res) => {
    const users = await getStudents();
    const result = await makeTask(req.body.taskName, req.body.startDate, 
        req.body.endDate, req.body.durationHours, req.body.durationMinutes, req.body.year, users.students);
    return res.status(result.status).end(result.error);
}

const checkAdmin = async (req, res, next) => {
    const userId = await getId(req.headers.authorization);
    const result = await getUser(userId);
    if (result.user.permissions) {
        return next();
    } else {
        return res.status(403).end("Only admins can perform such operation");
    }
}

const viewSubmissionStatus = async (req, res) => {
    const result = await getSubmissionStatus(req.params.taskName);
    return res.status(result.status).end(JSON.stringify(result.submissionStatus));
}

const getStudentPractices = async (req, res) => {
    const result = await getPractices(req.params.userId);
    return res.status(result.status).end(JSON.stringify(result.practices));
}

const changeGrade = async (req, res) => {
    const result = await updateGrade(req.body.userId, req.body.chatId, parseInt(req.body.newGrade));
    return res.status(result.status).end(result.error);
}

const updateTask = async (req, res) => {
    const result = await changeTask(req.body.taskName, req.body.newTaskName, req.body.newEndDate)
    return res.status(result.status).end(result.error);
}

const createFeedback = async (req, res) => {
    const result = await postFeedback(req.body.userId, req.body.chatId, req.body.feedback)
    return res.status(result.status).end(result.error);
}

const allowLateSubmit = async (req, res) => {
    const result = await giveLateSubmit(req.body.taskName, req.body.userId);
    return res.status(result.status).end(result.error);
}

const cancelLateSubmit = async (req, res) => {
    const result = await takeLateSubmit(req.body.taskName, req.body.userId);
    return res.status(result.status).end(result.error);
}

module.exports = {
    uploadCSVTree,
    checkAdmin,
    createTask,
    viewSubmissionStatus,
    getStudentPractices,
    changeGrade,
    createFeedback,
    updateTask,
    allowLateSubmit,
    cancelLateSubmit
};
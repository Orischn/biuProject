const { uploadFile, makeTask, getSubmissionStatus } = require('../models/adminPanel');
const { getPractices, updateGrade } = require('../models/chatbot');
const {getId} = require('../models/token');
const {getUser, getStudents} = require('../models/users');

const uploadCSVTree = async (req, res) => {
    const result = await uploadFile(req.body.fileName, req.body.CSVTree);
    return res.status(result.status).end(result.error);
}

const createTask = async (req, res) => {
    const users = await getStudents()
    const result = await makeTask(req.body.taskName, req.body.startDate, req.body.endDate, users.students);
    return res.status(result.status).end(result.error);
}

const checkAdmin = async (req, res, next) => {
    const userId = await getId(req.headers.authorization);
    const result = await getUser(userId);
    // console.log(result.user.permissions)
    if (result.user.permissions) {
        return next();
    } else {
        return res.status(403).end("Only admins can perform such operation");
    }
}

const viewSubmissionStatus = async (req, res) => {
    const result = await getSubmissionStatus(req.params.taskName);
    return res.status(result.status).end(result.submissionStatus);
}

const getStudentPractices = async (req, res) => {
    const result = await getPractices(req.params.userId);
    return res.status(result.status).end(JSON.stringify(result.practices));
}

const changeGrade = async (req, res) => {
    const result = await updateGrade(req.body.userId, req.body.chatId, parseInt(req.body.newGrade));
    return res.status(result.status).end(result.error);
}

module.exports = {
    uploadCSVTree,
    checkAdmin,
    createTask,
    viewSubmissionStatus,
    getStudentPractices,
    changeGrade,
};
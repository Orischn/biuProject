const { uploadFile, makeTask, getSubmissionStatus, postFeedback, changeTask, takeLateSubmit, giveLateSubmit, removeTask, adminViewTasks, uploadIdFile } = require('../models/adminPanel');
const { getPractices, updateGrade } = require('../models/chatbot');
const { getId } = require('../models/token');
const { getUser, getStudents } = require('../models/users');
const os = require('os');


const uploadCSVTree = async (req, res) => {
    const result = await uploadFile(req.body.fileName, req.body.CSVTree);
    return res.status(result.status).end(result.error);
}

const uploadValidIdFile = async (req, res) => {
    const result = await uploadIdFile(req.body.fileName, req.body.fileContent);
    return res.status(result.status).end(result.error);
}

const parseQuestionsFile = (questions) => {
    let lines = JSON.parse(questions).split(os.EOL);
    let questionsList = [];
    let answers = [];
    let part = 1
    for (let line of lines) {
        if (line === '') {
            part = 2
            continue
        }
        switch (part) {
            case 1:
                questionsList.push({"question":line});
                break;
            case 2:
                answers.push({"answer": line.split(',')})
                break;
        }
    }
    return {"questions": questionsList, "answers": answers};
}

const createTask = async (req, res) => {
    const users = await getStudents();
    questionJSON = parseQuestionsFile(req.body.questions)
    const result = await makeTask(req.body.taskName, req.body.startDate, 
        req.body.endDate, req.body.durationHours, req.body.durationMinutes, req.body.year,
        req.body.format, questionJSON, req.body.botPic, users.students);
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
    const result = await getSubmissionStatus(req.params.taskName, req.params.year);
    return res.status(result.status).end(JSON.stringify(result.submissionStatus));
}

const getStudentPractices = async (req, res) => {
    const result = await getPractices(req.params.userId);
    return res.status(result.status).end(JSON.stringify(result.practices));
}

const adminGetTasks = async (req, res) => {
    const result = await adminViewTasks(req.params.year);
    return res.status(result.status).end(JSON.stringify(result.tasks))
}

const changeGrade = async (req, res) => {
    const result = await updateGrade(req.body.userId, req.body.chatId, parseInt(req.body.newGrade));
    return res.status(result.status).end(result.error);
}

const updateTask = async (req, res) => {
    const result = await changeTask(req.body.taskName, req.body.newTaskName, req.body.newEndDate, req.body.year)
    return res.status(result.status).end(result.error);
}

const deleteTask = async (req, res) => {
    const result = await removeTask(req.body.taskName, req.body.year);
    return res.status(result.status).end(result.error);
}

const createFeedback = async (req, res) => {
    const result = await postFeedback(req.body.userId, req.body.chatId, req.body.feedback, req.body.year)
    return res.status(result.status).end(JSON.stringify(result.error));
}

const allowLateSubmit = async (req, res) => {
    const result = await giveLateSubmit(req.body.taskName, req.body.userId, req.body.endDate);
    return res.status(result.status).end(result.error);
}

const cancelLateSubmit = async (req, res) => {
    const result = await takeLateSubmit(req.body.taskName, req.body.userId);
    return res.status(result.status).end(result.error);
}

module.exports = {
    uploadCSVTree,
    uploadValidIdFile,
    checkAdmin,
    createTask,
    viewSubmissionStatus,
    getStudentPractices,
    adminGetTasks,
    changeGrade,
    createFeedback,
    updateTask,
    deleteTask,
    allowLateSubmit,
    cancelLateSubmit
};
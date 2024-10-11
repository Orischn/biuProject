const { getData } = require('../models/token.js');
const { getUser, postUser, deleteUser, changeAdminPermissions, getStudents } = require('../models/users.js');

const receiveUser = async (req, res) => {
    const result = await getUser(req.params.userId);
    return res.status(result.status).end(result.user);
}

const getMe = async (req, res) => {
    const userData = await getData(req.headers.authorization);
    const result = await getUser(userData.userId);
    return res.status(result.status).end(result.user);
}

const receiveAllStudents = async (req, res) => {
    const result = await getStudents();
    return res.status(result.status).end(result.students);
}

const createUser = async (req, res) => {
    const ret = await postUser(req.body.userId);
    return res.status(result.status).end(result.error);
}

const removeUser = async (req, res) => {
    const ret = await deleteUser(user);
    return res.status(result.status).end(result.error);
}

const changePermissions = async (req, res) => {
    const ret = await changeAdminPermissions(user, req.body.permissions);
    return res.status(result.status).end(result.error);
}

module.exports = {
    receiveUser,
    getMe,
    createUser,
    receiveAllStudents,
    removeUser,
    changePermissions,
};
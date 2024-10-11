const { getData } = require('../models/token.js');
const { getUser, postUser, deleteUser, changeAdminPermissions, getStudents, changeUserPassword } = require('../models/users.js');

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
    const result = await postUser(req.body.userId);
    return res.status(result.status).end(result.error);
}

const removeUser = async (req, res) => {
    const result = await deleteUser(user);
    return res.status(result.status).end(result.error);
}

const changePermissions = async (req, res) => {
    const result = await changeAdminPermissions(user, req.body.permissions);
    return res.status(result.status).end(result.error);
}

const changePassword = async (req, res) => {
    const userData = await getData(req.headers.authorization);
    const result = await getUser(userData.userId);
    if (res !== 200) {
        return res.status(result.status).end(result.user);
    }
    const changeResult = await changeUserPassword(result.user, req.body.oldPassword, req.body.newPassword)
    return res.status(changeResult.status).end(changeResult.user);

}

module.exports = {
    receiveUser,
    getMe,
    createUser,
    receiveAllStudents,
    removeUser,
    changePermissions,
    changePassword,
};

const { getId } = require('../models/token.js');
const { getUser, postUser, deleteUser, changeAdminPermissions, getStudents, changeUserPassword } = require('../models/users.js');

const receiveUser = async (req, res) => {
    const result = await getUser(req.params.userId);
    return res.status(result.status).end(JSON.stringify(result.user));
}

const getMe = async (req, res) => {
    const userId = await getId(req.headers.authorization);
    const result = await getUser(userId);
    return res.status(result.status).end(JSON.stringify(result.user));
}

const receiveAllStudents = async (req, res) => {
    const result = await getStudents();
    return res.status(result.status).end(JSON.stringify(result.students));
}

const createUser = async (req, res) => {
    const result = await postUser(req.body.userId);
    return res.status(result.status).end(result.error);
}

const removeUser = async (req, res) => {
    const user = await getUser(req.body.userId)
    const result = await deleteUser(user.user);
    return res.status(result.status).end(result.error);
}

const changePermissions = async (req, res) => {
    const result = await changeAdminPermissions(user, req.body.permissions);
    return res.status(result.status).end(result.error);
}

const changePassword = async (req, res) => {
    const userId = await getId(req.headers.authorization);
    const result = await getUser(userId);
    if (result.status !== 200) {
        return res.status(result.status).end(JSON.stringify(result.user));
    }
    const changeResult = await changeUserPassword(result.user, req.body.oldPassword, req.body.newPassword)
    return res.status(changeResult.status).end(JSON.stringify(changeResult.user));

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

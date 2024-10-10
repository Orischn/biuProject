const { getData } = require('../models/token.js');
const { getUser, postUser, deleteUser, changeAdminPermissions, getStudents, changeUserPassword } = require('../models/users.js');

const receiveUser = async (req, res) => {
    const user = await getUser(req.params.userId);
    if (user === 404) {
        return res.status(404).end();
    } else {
        return res.status(200).end(JSON.stringify(user));
    }
}

const getMe = async (req, res) => {
    const userData = await getData(req.headers.authorization);
    const me = await getUser(userData.userId)
    if (me === 404) {
        return res.status(404).end();
    } else {
        return res.status(200).end(JSON.stringify(me));
    }
}

const receiveAllStudents = async (req, res) => {
    const users = await getStudents();
    if (users === 404) {
        return res.status(404).end();
    } else if (users === 500) {
        return res.status(500).end("Internal server error");
    } else {
        return res.status(200).end(JSON.stringify(users));
    }
}

const createUser = async (req, res) => {
    const user = await postUser(req.body.user);
    if (user == 409) {
        return res.status(409).end('Creation of user failed (User already exists).');
    } else if (user == 500) {
        return res.status(500).end('Creation of user failed (Internal server error). Please contact the server administrator.');
    }
    return res.status(200).end('Creation was successful');
}

const removeUser = async (req, res) => {
    const user = await getUser(req.body.userId)
    if (user == 404) {
        res.end('Deletion of user failed (User doesn\'t exists).');
    }
    const ret = await deleteUser(user);
    res.status(ret);
    if (ret == 500) {
        res.end('Deletion of user failed (Internal server error). Please contact the server administrator.');
    }
    return res;
}

const changePermissions = async (req, res) => {
    const user = await getUser(req.body.userId)
    if (user == 404) {
        res.end('Deletion of user failed (User doesn\'t exists).');
    }
    const ret = await changeAdminPermissions(user, req.body.permissions);
    res.status(ret);
    if (ret == 500) {
        res.end('Deletion of user failed (Internal server error). Please contact the server administrator.');
    }
    return res;
}

const changePassword = async (req, res) => {
    const user = await getUser(req.body.userId);
    const oldPassword = req.body.oldPassword;
    if (oldPassword !== user.password) {
        return res.status(500).end('Changing password failed, wrong password')
    }

    const newPassword = req.body.newPassword;
    const ret = await changeUserPassword(user, newPassword)
    if (ret === 200) {
        return res.status(200).end('Successfully changed password');
    }

}

module.exports = {
    receiveUser,
    getMe,
    createUser,
    receiveAllStudents,
    removeUser,
    changePermissions,
    changePassword
}
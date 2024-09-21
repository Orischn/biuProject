const { getUser, getUsers, postUser, deleteUser, changeAdminPermissions } = require('../models/users.js');

const receiveUser = async (req, res) => {
    const user = await getUser(req.header.username);
    if (user === 401) {
        return res.status(401).end();
    } else {
        return res.status(200).end(JSON.stringify(user));
    }
}

const receiveAllUsers = async (req, res) => {
    const users = await getUsers();
    if (users === 401) {
        return res.status(401).end();
    } else {
        return res.status(200).end(JSON.stringify(users));
    }
}

const createUser = async (req, res) => {
    const ret = await postUser(getUser(req.body.username));
    res.status(ret);
    if (ret == 409) {
        res.end('Creation of user failed (User already exists).');
    } else if (ret == 500) {
        res.end('Creation of user failed (Internal server error). Please contact the server administrator.');
    }
    return res;
}

const removeUser = async (req, res) => {
    const user = getUser(req.body.username)
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
    const user = getUser(req.body.username)
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

module.exports = {
    receiveUser,
    createUser,
    receiveAllUsers,
    removeUser,
    changePermissions,
}
const { getUser, getUsers, postUser, deleteUser } = require('../models/users.js');

const receiveUser = async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    const user = await getUser(req.params.username);
    if (user === 401) {
        return res.status(401).end();
    } else {
        return res.status(200).end(JSON.stringify(user));
    }
}

const receiveAllUsers = async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    const users = await getUsers();
    if (user === 401) {
        return res.status(401).end();
    } else {
        return res.status(200).end(JSON.stringify(users));
    }
}

const createUser = async (req, res) => {
    
}

const removeUser = async (req, res) => {

}

module.exports = {
    receiveUser,
    createUser,
    receiveAllUsers,
    removeUser,
}
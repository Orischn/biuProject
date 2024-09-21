const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const key = "Let S be an orthogonal transformation of gram schmidt";
const { getUser } = require('./users');

const checkToken = async (authorization) => {
    if (authorization) {
        const token = authorization.split(" ")[1];
        try {
            await jwt.verify(token, key);
            return 200;
        } catch (err) {
            return 401;
        }
    } else {
        return 401;
    }
}

const postToken = async (user) => {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const users = db.collection('users');
        const existingUser = await users.findOne({username: user.username, password: user.password});
        if (!existingUser || existingUser == 404) {
            return 404;
        }

        if (existingUser == 500) {
            return 500;
        }
        
        const token = await jwt.sign(user, key);
        return token;
    } catch (error) {
        return 500;
    } finally {
        await client.close();
    }
}

const getData = async (authorization) => {
    if (authorization) {
        const token = authorization.split(" ")[1];
        try {
            const data = await jwt.verify(token, key);
            return data;
        } catch (err) {
            return 401;
        }
    } else {
        return 403;
    }
}

module.exports = {
    postToken,
    checkToken,
    getData,
}
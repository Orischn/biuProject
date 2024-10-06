const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const key = "Sara shara shir sameihah shir sameihah shara Sara";

const checkToken = async (authorization) => {
    if (authorization) {
        const token = authorization.split(" ")[1];
        try {
            jwt.verify(token, key);
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
        const existingUser = await users.findOne({userId: user.userId, password: user.password});
        if (!existingUser) {
            return 404;
        }
        const token = jwt.sign(user, key);
        return token;
    } catch (error) {
        console.log(error)
        return 500;
    } finally {
        await client.close();
    }
}

const getData = async (authorization) => {
    if (authorization) {
        const token = authorization.split(" ")[1];
        try {
            const data = jwt.verify(token, key);
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
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const key = "Sara shara shir sameihah shir sameihah shara Sara";

const checkToken = async (authorization) => {
    if (authorization) {
        const token = authorization.split(" ")[1];
        try {
            await jwt.verify(token, key);
            return { status: 200, error: "" };
        } catch (err) {
            return { status: 401, error: err };
        }
    } else {
        return { status: 401, error: "No authorization token provided." };
    }
}

const postToken = async (user) => {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const users = db.collection('users');
        const existingUser = await users.findOne({ userId: user.userId, password: user.password }).toArray();
        if (!existingUser) {
            return { status: 404, token: "User doesn't exist." };
        }
        const token = jwt.sign(user.userId, key);
        return { status: 200, token: token };
    } catch (error) {
        return { status: 500, token: error };
    } finally {
        await client.close();
    }
}

const getData = async (authorization) => {
    try {
        const token = authorization.split(" ")[1];
        const data = await jwt.verify(token, key);
        return data;
    } catch (err) {
        return null;
    }
}

module.exports = {
    postToken,
    checkToken,
    getData,
};
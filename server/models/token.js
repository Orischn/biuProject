const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');



const checkToken = async (authorization) => {
    if (authorization) {
        const token = authorization.split(" ")[1];
        try {
            jwt.verify(token, process.env.SECRET_TOKEN);
            return { status: 200, error: "" };
        } catch (err) {
            return { status: 401, error: err.message };
        }
    } else {
        return { status: 401, error: "No authorization token provided." };
    }
}

const postToken = async (user) => {
    console.log(user);
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const users = db.collection('users');

        const existingUser = await users.findOne({ userId: user.userId });
        if (!existingUser) {
            return { status: 404, token: "User doesn't exist." };
        }

        // Compare the input password with the stored hashed password
        const passwordMatch = await bcrypt.compare(user.password, existingUser.password);
        if (!passwordMatch) {
            return { status: 401, token: "Password is incorrect." };
        }
        const token = jwt.sign(user.userId, process.env.SECRET_TOKEN);
        return { status: 200, token: token };
    } catch (error) {
        return { status: 500, token: error.message };
    } finally {
        await client.close();
    }
}

const getId = async (authorization) => {
    try {
        const token = authorization.split(" ")[1];
        const data = jwt.verify(token, process.env.SECRET_TOKEN);
        return data;
    } catch (err) {
        return null;
    }
}

module.exports = {
    postToken,
    checkToken,
    getId,
};
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const mongoSanitize = require('mongo-sanitize');


const checkToken = async (authorization) => {
    if (authorization) {
        const token = authorization.split(" ")[1];
        try {
            data = jwt.verify(token, process.env.SECRET_TOKEN);
            jwt.sign({ id: data.id }, process.env.SECRET_TOKEN, {expiresIn: '30m'});
            return { status: 200, error: "" };
        } catch (err) {
            return { status: 401, error: err.message };
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

        const existingUser = await users.findOne({ userId: { $eq: mongoSanitize(user.userId) } });
        if (!existingUser) {
            return { status: 404, token: "User doesn't exist." };
        }

        // Compare the input password with the stored hashed password
        const passwordMatch = await bcrypt.compare(user.password, existingUser.password);
        if (!passwordMatch) {
            return { status: 404, token: "Password is incorrect." };
        }
        const token = jwt.sign({ id: mongoSanitize(user.userId) }, process.env.SECRET_TOKEN, {expiresIn: '30m'});
        const refreshToken = jwt.sign({ id: mongoSanitize(user.userId) }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '24h' });
        return { status: 200, token: token, refreshToken: refreshToken };
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
        return data.id;
    } catch (err) {
        return null;
    }
}

const refresh = async (req, res) => {
    if (!req.headers.cookie) return res.sendStatus(403)
    let refreshToken = req.headers.cookie;
    refreshToken = refreshToken.slice(refreshToken.indexOf('=') + 1)
    console.log(refreshToken)
    if (!refreshToken) return res.sendStatus(403);
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        
        const accessToken = jwt.sign({ id: user.id }, process.env.SECRET_TOKEN, { expiresIn: '30m' });
        res.json({ accessToken });
    });
    return res.end();
}

module.exports = {
    postToken,
    checkToken,
    getId,
    refresh,
};
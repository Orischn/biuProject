const { checkToken, postToken } = require('../models/token');

const validateUser = async (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    const status = await checkToken(req.headers.authorization);
    if (status === 401) {
        return res.status(401).send("Invalid Token").end();
    } else if (status === 403) {
        return res.status(403).send('Token required').end();
    } else {
        return next();
    }
}

const login = async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    const token = await postToken(req.body);
    if (token === 404) {
        return res.status(token).end('Incorrect username and/or password');
    } else if (token === 500) {
        return res.status(500).end();
    }
    return res.status(200).end(token);
}

module.exports = {
    validateUser,
    login,
}
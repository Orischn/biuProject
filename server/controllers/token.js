const { checkToken, postToken } = require('../models/token');

const validateUser = async (req, res, next) => {
    const status = await checkToken(req.headers.authorization);
    if (status === 401) {
        return res.status(401).end("Invalid Token");
    } else if (status === 403) {
        return res.status(403).end('Token required');
    } else {
        return next();
    }
}

const login = async (req, res) => {
    const token = await postToken(req.body);
    if (token === 404) {
        return res.status(token).end('Incorrect id and/or password');
    } else if (token === 500) {
        return res.status(500).end();
    }
    return res.status(200).end(token);
}

module.exports = {
    validateUser,
    login,
}
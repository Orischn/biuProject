const { checkToken, postToken } = require('../models/token');

const validateUser = async (req, res, next) => {
    const result = await checkToken(req.headers.authorization);
    return res.status(result.status).end(result.error);
}

const login = async (req, res) => {
    const result = await postToken(req.body);
    return res.status(result.status).end(result.token);
}

module.exports = {
    validateUser,
    login,
};
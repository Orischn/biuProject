const { checkToken, postToken, refresh } = require('../models/token');

const validateUser = async (req, res, next) => {
    const result = await checkToken(req.headers.authorization);
    if (result.status === 200) {
        return next();
    }
    return res.status(result.status).end(result.error);
}

const login = async (req, res) => {
    const result = await postToken(req.body);
    if (result.refreshToken) {
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000,
        });
    }
    return res.status(result.status).end(result.token);
}

const refreshAccessToken = async (req, res) => {
    return await refresh(req, res);
}

module.exports = {
    validateUser,
    login,
    refreshAccessToken,
};
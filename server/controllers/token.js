const { checkToken, postToken, refresh, expireSessionTokens, getId } = require('../models/token');

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
            expires: new Date(Date.now() + 12 * 3600000),
        });
    }
    return res.status(result.status).end(result.token);
}

const logout = async (req,res) => {
    const userId = await getId(req.headers.authorization)
    expireSessionTokens(userId);
    res.cookie('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        expires: new Date(0),
    });
    return res.status(200).end()
}

const refreshAccessToken = async (req, res) => {
    return await refresh(req, res);
}

module.exports = {
    validateUser,
    login,
    logout,
    refreshAccessToken,
};
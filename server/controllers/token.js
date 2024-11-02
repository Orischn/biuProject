const { checkToken, postToken } = require('../models/token');

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
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
    return res.status(result.status).end(result.token);
}

const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        
        const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
        res.json({ accessToken });
    });
    return res.end();
}

module.exports = {
    validateUser,
    login,
    refresh,
};
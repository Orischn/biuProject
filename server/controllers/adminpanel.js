const {getData} = require('../models/token');
const {getUser} = require('../models/users')

const uploadTree = async (req, res) => {
    
}

const checkAdmin = async (req, res, next) => {
    const userData = await getData(req.headers.authorization)

    const user = await getUser(userData.userId)
    if (user.permissions) {
        return next();
    } else {
        return res.status(401).end("Only admins can perform such operation.")
    }
}

module.exports = {
    uploadTree,
    checkAdmin,
}
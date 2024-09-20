const {getData} = require('../models/token');
const {getUser} = require('../models/users')

const uploadTree = async (req, res) => {
    
}

const checkAdmin = async (req, res, next) => {
    const userData = getData(req.header.authorization)
    const user = getUser(userData.username)
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
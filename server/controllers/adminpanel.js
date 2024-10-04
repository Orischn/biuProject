const { uploadFile } = require('../models/adminPanel');
const {getData} = require('../models/token');
const {getUser} = require('../models/users')

const uploadCSVTree = async (req, res) => {
    const result = uploadFile(req.body.fileName, req.body.CSVtree);
    res.status(result)
    if (result === 500) {
        return res.end("Internal Server Error");
    } else if (result === 400) {
        return res.end(`The server only accepts .csv files and ${req.body.fileName} does not end in .csv`);
    }
    return res.end();
}

const checkAdmin = async (req, res, next) => {
    const userData = await getData(req.headers.authorization)

    const user = await getUser(userData.userId)
    if (user.permissions) {
        return next();
    } else {
        return res.status(403).end("Only admins can perform such operation")
    }
}

module.exports = {
    uploadCSVTree,
    checkAdmin,
}
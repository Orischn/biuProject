const { uploadFile } = require('../models/adminPanel');
const {getData} = require('../models/token');
const {getUser} = require('../models/users')

const uploadCSVTree = async (req, res) => {
    const result = await uploadFile(req.body.fileName, req.body.CSVTree);
    if (result === 500) {
        return res.status(500).end("Internal Server Error");
    } else if (result === 400) {
        return res.status(400).end(`The server only accepts .csv files and ${req.body.fileName} does not end in .csv`);
    } else if (result) {
        return res.status(500).end(result);
    }
    return res.status(200).end();
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
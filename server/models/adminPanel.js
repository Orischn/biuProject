const fs = require('fs')

async function uploadFile(fileName, fileContent) {
    if (!fileName.endsWith('.csv')) return 400;
    try {
        fs.writeFile('decisionTree.csv', fileContent)
        return 200;
    } catch (error) {
        return 500;
    }
}

module.exports = {
    uploadFile,
}
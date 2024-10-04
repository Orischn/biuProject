const fs = require('fs')

async function uploadFile(fileName, fileContent) {
    // if (!fileName.endsWith('.csv')) return 400;
    let error = null;
    try {
        fs.writeFile('csvFiles/decisionTree.csv', fileContent, (err) => {
            if(err) {
                error = err;
            }
        });
        return error;
    } catch (error) {
        console.log(error)
        return 500;
    }
}

module.exports = {
    uploadFile,
}
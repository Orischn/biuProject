const fs = require('fs');
const { MongoClient } = require('mongodb');

async function uploadFile(fileName, fileContent) {
    let error = null;
    try {
        fs.writeFile(`csvFiles/${fileName}`, fileContent, (err) => {
            if(err) {
                error = err;
            }
        });
        return { status: 500, error: error.message };
    } catch (error) {
        return { status: 500, error: error.message };
    }
}

async function makeTask(taskName, startingDate, endingDate, users) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const tasks = db.collection('tasks');
        submitList = [];
        users.map((user) => {
            submitList.push({ userId: user.id, firstName: user.firstName, lastName: user.lastName, didSubmit: false });
        });
        await tasks.insertOne(
            {
                taskName: taskName,
                startDate: startingDate,
                endDate: endingDate,
                submitList: submitList
            },
        );
        return { status: 200, error: "" };
    } catch (error) {
        console.log(error.message)
        return { status: 500, error: error.message };
    } finally {
        await client.close();
    }
}

async function getTasks() {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const tasks = db.collection('tasks');
        const taskList = await tasks.find({}, { projection: { submitList: 0 } }).toArray();
        return { status : 200, tasks: taskList };
    } catch (error) {
        return { status: 500, tasks: error.message };
    } finally {
        await client.close();
    }
}

async function getSubmissionStatus(taskName) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const tasks = db.collection('tasks');
        const task = await tasks.findOne({ taskName: taskName });
        if (!task) {
            return { status: 404, submissionStatus: "No such task." };
        }
        return { status: 200, submissionStatus: task.submitList };
    } catch (error) {
        return { status: 500, submissionStatus: error.message };
    } finally {
        await client.close();
    }
}

module.exports = {
    uploadFile,
    makeTask,
    getTasks,
    getSubmissionStatus,
};
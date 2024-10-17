const fs = require('fs');
const { MongoClient } = require('mongodb');

async function uploadFile(fileName, fileContent) {
    let error = null;
    try {
        fs.writeFile(`csvFiles/${fileName}`, fileContent, (err) => {
            if (err) {
                error = err;
            }
        });
        return { status: 500, error: error.message };
    } catch (error) {
        return { status: 500, error: error.message };
    }
}

async function makeTask(taskName, startingDate, endingDate, durationHours, durationMinutes, year, users) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const tasks = db.collection('tasks');
        submitList = [];
        users.filter((user) => user.year === year).map((user) => {
            submitList.push({ userId: user.userId, firstName: user.firstName, lastName: user.lastName, didSubmit: false, canSubmitLate: false });
        });
        await tasks.insertOne(
            {
                taskName: taskName,
                startDate: startingDate,
                endDate: endingDate,
                durationHours: parseInt(durationHours),
                durationMinutes: parseInt(durationMinutes),
                year: year,
                submitList: submitList,
            },
        );
        return { status: 200, error: "" };
    } catch (error) {
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
        return { status: 200, tasks: taskList };
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

async function postFeedback(userId, chatId, feedback) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('practices');
        await practices.updateOne(
            { chatId: chatId, userId: userId, active: false },
            {
                $set: {
                    feedback: feedback,
                },
            },
        );
        return { status: 200, error: '' }
    } catch (error) {
        return { status: 500, error: error.message }
    } finally {
        await client.close()
    }
}

async function changeTask(taskName, newTaskName, newEndDate) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const tasks = db.collection('tasks');
        const practices = db.collection('practices');

        await tasks.updateOne(
            { taskName: taskName },
            {
                $set: {
                    taskName: newTaskName,
                    endDate: newEndDate,
                },
            },
        );

        await practices.updateMany(
            { chatId: taskName },
            {
                $set: {
                    chatId: newTaskName,
                },
            },
        );

        return { status: 200, error: '' }
    } catch (error) {
        return { status: 500, error: error.message }
    } finally {
        await client.close()
    }
}

async function giveLateSubmit(taskName, userId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const tasks = db.collection('tasks');
        const practices = db.collection('practices');

        await tasks.updateOne(
            { taskName: taskName, 'submitList.userId': userId },
            {
                $set: {
                    'submitList.$.canSubmitLate': true,
                }
            }
        );

        await practices.updateOne(
            { chatId: taskName, userId: userId},
            {
                $set: {
                    lateSubmit: true,
                },
            },
        );
        return { status: 200, error: '' }
    } catch (error) {
        return { status: 500, error: error.message }
    } finally {
        await client.close()
    }
}


async function takeLateSubmit(taskName, userId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const tasks = db.collection('tasks');

        await tasks.updateOne(
            { taskName: taskName, 'submitList.userId': userId },
            {
                $set: {
                    'submitList.$.canSubmitLate': false,
                }
            }
        );

        await practices.updateOne(
            { chatId: taskName, userId: userId},
            {
                $set: {
                    lateSubmit: false,
                },
            },
        );
        return { status: 200, error: '' }
    } catch (error) {
        return { status: 500, error: error.message }
    } finally {
        await client.close()
    }
}

module.exports = {
    uploadFile,
    makeTask,
    getTasks,
    getSubmissionStatus,
    postFeedback,
    changeTask,
    giveLateSubmit,
    takeLateSubmit
};
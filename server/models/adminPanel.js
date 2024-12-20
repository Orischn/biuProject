const fs = require('fs');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const mongoSanitize = require('mongo-sanitize');
const { botProcesses, getSubmissionData } = require('./chatbot');


const client = new MongoClient("mongodb://127.0.0.1:27017");
const dbName = 'ChatBot';
const db = client.db(dbName);
const tasks = db.collection('tasks');
const practices = db.collection('practices');


async function uploadIdFile(fileContent) {
    let error = null;
    try {
        fs.writeFileSync('validIds.txt', fileContent);
    } catch (err) {
        error = err;
    }
    return error ? { status: 500, error: error.message } : { status: 200, error: '' };
}

async function makeTask(taskName, startingDate, endingDate, durationHours, durationMinutes, year, questions, botPic, users) {
    try {
        const existingTask = await tasks.findOne({
            taskName:
                { $eq: mongoSanitize(taskName) }, year: { $eq: parseInt(year) }
        })
        if (existingTask) {
            return { status: 409, error: `This task already exists this year` }
        }
        if (endingDate <= startingDate) {
            return { status: 400, error: 'Task end date preceeds starting date!'}
        }
        const submitList = users
            .filter(user => user.year === parseInt(year))
            .map(user => ({
                userId: mongoSanitize(user.userId),
                firstName: mongoSanitize(user.firstName),
                lastName: mongoSanitize(user.lastName),
                didSubmit: false,
                canSubmitLate: false,
                grade: null,
                feedback: '',
                endDate: endingDate,
            }));
        await tasks.insertOne({
            taskName: mongoSanitize(taskName),
            startDate: parseInt(startingDate),
            endDate: parseInt(endingDate),
            questions: Buffer.from(JSON.stringify(questions)).toString('base64'),
            durationHours: durationHours ? parseInt(durationHours) : null,
            durationMinutes: durationMinutes ? parseInt(durationMinutes) : null,
            year: parseInt(year),
            botPic: Buffer.from(botPic).toString('base64'),
            submitList: submitList,
        });
        return { status: 201, error: "" };
    } catch (error) {
        return { status: 500, error: error.message };
    }
}

async function getTasks(year) {
    try {
        const taskList = await tasks.find({year: parseInt(year), startDate: { $lt: Date.now() } }, { projection: { submitList: 0, questions: 0 } }).toArray();
        if (!taskList) {
            return { status: 404, tasks: 'No existing tasks' }
        }
        return { status: 200, tasks: taskList };
    } catch (error) {
        return { status: 500, tasks: error.message };
    }
}

async function getTask(taskName, year) {
    try {
        const task = await tasks.findOne({ taskName: { $eq: mongoSanitize(taskName) }, year: { $eq: parseInt(year) } });
        task.submitList.forEach(submitData => {
            if (submitData.feedback) {
                submitData.feedback = Buffer.from(submitData.feedback, 'base64').toString('utf-8')
            }
        })
        return { status: 200, task: task };
    } catch (error) {
        return { status: 500, task: error.message };
    }
}

async function adminViewTasks(year) {
    try {
        const taskList = await tasks.find({ year: { $eq: parseInt(year) } }).toArray();
        if (!taskList) {
            return { status: 404, tasks: 'No existing tasks' }
        }
        taskList.forEach(task => {
            task.submitList.forEach(submitData => {
                if (submitData.feedback) {
                    submitData.feedback = Buffer.from(submitData.feedback, 'base64').toString('utf-8')
                }
            })
        })
        return { status: 200, tasks: taskList };
    } catch (error) {
        return { status: 500, tasks: error.message };
    }
}

async function getSubmissionStatus(taskName, year) {
    try {
        const task = await tasks.findOne({
            taskName:
                { $eq: mongoSanitize(taskName) }, year: { $eq: parseInt(year) }
        });
        if (!task) {
            return { status: 404, submissionStatus: "No such task." };
        }
        task.submitList.forEach(submitData => {
            if (submitData.feedback) {
                submitData.feedback = Buffer.from(submitData.feedback, 'base64').toString('utf-8')
            }
        })
        return { status: 200, submissionStatus: task.submitList };
    } catch (error) {
        return { status: 500, submissionStatus: error.message };
    }
}

async function postFeedback(userId, chatId, feedback, year) {
    try {
        await practices.updateOne(
            {
                chatId:
                    { $eq: mongoSanitize(chatId) }, userId: { $eq: mongoSanitize(userId) },
                year: { $eq: mongoSanitize(year) }
            },
            {
                $set: {
                    feedback: Buffer.from(feedback).toString('base64'),
                },
            },
        );

        await tasks.updateOne(
            {
                taskName: { $eq: mongoSanitize(chatId) }, year: { $eq: parseInt(year) },
                'submitList.userId': { $eq: mongoSanitize(userId) },
            },
            {
                $set: {
                    'submitList.$.feedback': Buffer.from(feedback).toString('base64'),
                },
            },
        );
        return { status: 200, feedback: feedback };
    } catch (error) {
        return { status: 500, feedback: error.message };
    }
}

async function changeTask(taskName, newEndDate, year) {
    try {

        const currentTask = await tasks.findOne({
            taskName: { $eq: mongoSanitize(taskName) },
            year: { $eq: parseInt(year) }
        });

        if (parseInt(newEndDate) < currentTask.endDate) {
            return { status: 400, error: "Can't shorten assignment time." };
        }

        await tasks.updateMany(
            { taskName: { $eq: mongoSanitize(taskName) }, year: { $eq: parseInt(year) } },
            {
                $max: {
                    'submitList.$[].endDate': newEndDate
                },
            },
        );

        await tasks.updateOne(
            { taskName: { $eq: mongoSanitize(taskName) }, year: { $eq: parseInt(year) } },
            {
                $set: {
                    endDate: parseInt(newEndDate),
                },
            },
        );

        await practices.updateMany(
            {
                chatId: { $eq: mongoSanitize(taskName) },
                year: { $eq: parseInt(year) }
            },
            [
                {
                    $set: {
                        endDate: {
                            $max: ["$endDate", parseInt(newEndDate)]
                        }
                    }
                }
            ]
        );

        return { status: 200, error: '' };
    } catch (error) {
        console.log(error.message)
        return { status: 500, error: error.message };
    }
}

async function removeTask(taskName, year) {
    try {
        await tasks.deleteMany({
            taskName:
                { $eq: mongoSanitize(taskName) }, year: { $eq: parseInt(year) }
        });
        await practices.deleteMany({
            chatId:
                { $eq: mongoSanitize(taskName) }, year: { $eq: parseInt(year) }
        });
        return { status: 200, error: '' };
    } catch (error) {
        return { status: 500, error: error.message };
    }
}

async function giveLateSubmit(taskName, userId, endDate, year) {
    try {
        const result = await getSubmissionData(taskName, userId, parseInt(year));
        if (result.status !== 200) {
            return result;
        }
        if (parseInt(endDate) < result.submitData.endDate) {
            return { status: 400, error: "Can't shorten assignment time." };
        }

        await tasks.updateOne(
            {
                taskName:
                    { $eq: mongoSanitize(taskName) }, 'submitList.userId': { $eq: mongoSanitize(userId) }
            },
            {
                $set: {
                    'submitList.$.endDate': parseInt(endDate),
                },
            }
        );

        await practices.updateOne(
            { chatId: mongoSanitize(taskName), userId: mongoSanitize(userId) },
            {
                $set: {
                    endDate: parseInt(endDate),
                },
            },
        );
        return { status: 200, error: '' };
    } catch (error) {
        return { status: 500, error: error.message };
    }
}

async function takeLateSubmit(taskName, userId) {
    try {
        await tasks.updateOne(
            { taskName: { $eq: mongoSanitize(taskName) }, 'submitList.userId': { $eq: mongoSanitize(userId) } },
            {
                $set: {
                    'submitList.$.endDate': null,
                },
            }
        );

        await practices.updateOne(
            { chatId: { $eq: mongoSanitize(taskName) }, userId: { $eq: mongoSanitize(userId) } },
            {
                $set: {
                    'endDate': null,
                },
            },
        );
        return { status: 200, error: '' };
    } catch (error) {
        return { status: 500, error: error.message };
    }
}

module.exports = {
    uploadIdFile,
    makeTask,
    getTasks,
    getTask,
    adminViewTasks,
    getSubmissionStatus,
    postFeedback,
    changeTask,
    removeTask,
    giveLateSubmit,
    takeLateSubmit,
};

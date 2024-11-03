const fs = require('fs');
const { MongoClient } = require('mongodb');
const { check, validationResult } = require('express-validator');
const { format } = require('path');
require('dotenv').config();


const client = new MongoClient("mongodb://127.0.0.1:27017");
// const client = new MongoClient("mongodb://appUser:}]zpT3r^b|z@127.0.0.1:27017/ChatBot");

const dbName = 'ChatBot';
const db = client.db(dbName);
const tasks = db.collection('tasks');
const practices = db.collection('practices');

// Middleware for validating inputs
const validateTaskInputs = [
    check('taskName').isString().trim().escape(),
    check('startingDate').isISO8601(),
    check('endingDate').isISO8601(),
    check('durationHours').isInt({ min: 0 }),
    check('durationMinutes').isInt({ min: 0 }),
    check('year').isInt({ min: 0 }),
];

async function uploadFile(fileName, fileContent) {
    let error = null;
    try {
        fs.writeFileSync(`csvFiles/${fileName}`, fileContent); // Use synchronous to ensure completion
    } catch (err) {
        error = err;
    }
    return error ? { status: 500, error: error.message } : { status: 200 };
}

async function uploadIdFile(fileName, fileContent) {
    let error = null;
    try {
        fs.writeFileSync(fileName, fileContent);
    } catch (err) {
        error = err;
    }
    return error ? { status: 500, error: error.message } : { status: 200, error: '' };
}

async function makeTask(taskName, startingDate, endingDate, durationHours, durationMinutes, year, format, questions, botPic, users) {
    const errors = validationResult(users); // Assuming `users` is coming from the request body
    if (!errors.isEmpty()) {
        return { status: 400, errors: errors.array() };
    }

    try {
        const existingTask = await tasks.findOne({ taskName: { $eq: taskName }, year: { $eq: year } })
        if (existingTask) {
            return { status: 409, error: `This task already exists this year` }
        }
        const submitList = users
            .filter(user => user.year === year)
            .map(user => ({
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                didSubmit: false,
                canSubmitLate: false,
                grade: null,
                feedback: '',
                endDate: null,
            }));
        await tasks.insertOne({
            taskName: taskName,
            startDate: startingDate,
            endDate: endingDate,
            format: format,
            questions: questions,
            durationHours: durationHours ? parseInt(durationHours, 10) : null,
            durationMinutes: durationMinutes ?  parseInt(durationMinutes, 10) : null,
            year: year,
            botPic: botPic,
            submitList: submitList,
        });
        return { status: 201, error: "" };
    } catch (error) {
        return { status: 500, error: error.message };
    }
}

async function getTasks() {
    try {
        const taskList = await tasks.find({}, { projection: { submitList: 0 } }).toArray();
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
        const task = await tasks.findOne({ taskName: { $eq: taskName }, year: { $eq: year } });
        return { status: 200, task: task };
    } catch (error) {
        return { status: 500, task: error.message };
    }
}

async function adminViewTasks(year) {
    try {
        const taskList = await tasks.find({year: { $eq: parseInt(year) }}).toArray();
        if (!taskList) {
            return { status: 404, tasks: 'No existing tasks' }
        }
        return { status: 200, tasks: taskList };
    } catch (error) {
        return { status: 500, tasks: error.message };
    }
}

async function getSubmissionStatus(taskName, year) {
    try {
        const task = await tasks.findOne({ taskName: { $eq: taskName }, year: { $eq: parseInt(year, 10) } });
        if (!task) {
            return { status: 404, submissionStatus: "No such task." };
        }
        return { status: 200, submissionStatus: task.submitList };
    } catch (error) {
        return { status: 500, submissionStatus: error.message };
    }
}

async function postFeedback(userId, chatId, feedback, year) {
    try {
        await practices.updateOne(
            { chatId: { $eq: chatId }, userId: { $eq: userId }, year: { $eq: year } },
            {
                $set: {
                    feedback: feedback,
                },
            },
        );

        await tasks.updateOne(
            { taskName: { $eq: chatId }, year: { $eq: year }, 'submitList.userId': { $eq: userId } },
            {
                $set: {
                    'submitList.$.feedback': feedback
                },
            },
        );
        return { status: 200, error: feedback };
    } catch (error) {
        return { status: 500, error: error.message };
    }
}

async function changeTask(taskName, newTaskName, newEndDate, year) {
    try {
        const existingTask = await tasks.findOne({taskName: { $eq: newTaskName }, year: { $eq: parseInt(year) } });
        if(existingTask && taskName !== newTaskName) {
            return { status: 400, error: 'A task with this name is already existing this year'}
        }

        await tasks.updateOne(
            { taskName: { $eq: taskName }, year: { $eq: parseInt(year) } },
            {
                $set: {
                    taskName: newTaskName,
                },
                $max: {
                    endDate: newEndDate,
                },
            },
        );

        await practices.updateMany(
            { chatId: { $eq: taskName }, year: { $eq: parseInt(year) } },
            {
                $set: {
                    chatId: newTaskName,
                },
                $max: {
                    endDate: newEndDate,
                },
            },
        );

        return { status: 200, error: '' };
    } catch (error) {
        return { status: 500, error: error.message };
    }
}

async function removeTask(taskName, year) {
    try {
        await tasks.deleteMany({ taskName: { $eq: taskName }, year: { $eq: parseInt(year) } });
        await practices.deleteMany({ chatId: { $eq: taskName }, year: { $eq: parseInt(year) } });
        return { status: 200, error: '' };
    } catch (error) {
        return { status: 500, error: error.message };
    }
}

async function giveLateSubmit(taskName, userId, endDate) {
    try {
        await tasks.updateOne(
            { taskName: { $eq: taskName }, 'submitList.userId': { $eq: userId } },
            {
                $set: {
                    'submitList.$.endDate': endDate,
                },
            }
        );

        await practices.updateOne(
            { chatId: taskName, userId: userId },
            {
                $set: {
                    endDate: endDate,
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
            { taskName: { $eq: taskName }, 'submitList.userId': { $eq: userId } },
            {
                $set: {
                    'submitList.$.endDate': null,
                },
            }
        );

        await practices.updateOne(
            { chatId: { $eq: taskName }, userId: { $eq: userId } },
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
    uploadFile,
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
    validateTaskInputs, // Export validation middleware for use in routes
};

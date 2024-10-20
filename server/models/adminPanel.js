// const fs = require('fs');
// const { MongoClient } = require('mongodb');

// async function uploadFile(fileName, fileContent) {
//     let error = null;
//     try {
//         fs.writeFile(`csvFiles/${fileName}`, fileContent, (err) => {
//             if (err) {
//                 error = err;
//             }
//         });
//         return { status: 500, error: error.message };
//     } catch (error) {
//         return { status: 500, error: error.message };
//     }
// }

// async function makeTask(taskName, startingDate, endingDate, durationHours, durationMinutes, year, users) {
//     const client = new MongoClient("mongodb://127.0.0.1:27017");
//     try {
//         await client.connect();
//         const db = client.db('ChatBot');
//         const tasks = db.collection('tasks');
//         submitList = [];
//         users.filter((user) => user.year === year).map((user) => {
//             submitList.push({ userId: user.userId, firstName: user.firstName, lastName: user.lastName, didSubmit: false, canSubmitLate: false });
//         });
//         await tasks.insertOne(
//             {
//                 taskName: taskName,
//                 startDate: startingDate,
//                 endDate: endingDate,
//                 durationHours: parseInt(durationHours),
//                 durationMinutes: parseInt(durationMinutes),
//                 year: year,
//                 submitList: submitList,
//             },
//         );
//         return { status: 200, error: "" };
//     } catch (error) {
//         return { status: 500, error: error.message };
//     } finally {
//         await client.close();
//     }
// }

// async function getTasks() {
//     const client = new MongoClient("mongodb://127.0.0.1:27017");
//     try {
//         await client.connect();
//         const db = client.db('ChatBot');
//         const tasks = db.collection('tasks');
//         const taskList = await tasks.find({}, { projection: { submitList: 0 } }).toArray();
//         return { status: 200, tasks: taskList };
//     } catch (error) {
//         return { status: 500, tasks: error.message };
//     } finally {
//         await client.close();
//     }
// }

// async function getSubmissionStatus(taskName, year) {
//     const client = new MongoClient("mongodb://127.0.0.1:27017");
//     try {
//         await client.connect();
//         const db = client.db('ChatBot');
//         const tasks = db.collection('tasks');
//         const task = await tasks.findOne({ taskName: taskName, year: parseInt(year) });
//         if (!task) {
//             return { status: 404, submissionStatus: "No such task." };
//         }
//         return { status: 200, submissionStatus: task.submitList };
//     } catch (error) {
//         return { status: 500, submissionStatus: error.message };
//     } finally {
//         await client.close();
//     }
// }

// async function postFeedback(userId, chatId, feedback) {
//     const client = new MongoClient("mongodb://127.0.0.1:27017");
//     try {
//         await client.connect();
//         const db = client.db('ChatBot');
//         const practices = db.collection('practices');
//         await practices.updateOne(
//             { chatId: chatId, userId: userId, active: false },
//             {
//                 $set: {
//                     feedback: feedback,
//                 },
//             },
//         );
//         return { status: 200, error: feedback }
//     } catch (error) {
//         return { status: 500, error: error.message }
//     } finally {
//         await client.close()
//     }
// }

// async function changeTask(taskName, newTaskName, newEndDate) {
//     const client = new MongoClient("mongodb://127.0.0.1:27017");
//     try {
//         await client.connect();
//         const db = client.db('ChatBot');
//         const tasks = db.collection('tasks');
//         const practices = db.collection('practices');

//         await tasks.updateOne(
//             { taskName: taskName },
//             {
//                 $set: {
//                     taskName: newTaskName,
//                     endDate: newEndDate,
//                 },
//             },
//         );

//         await practices.updateMany(
//             { chatId: taskName },
//             {
//                 $set: {
//                     chatId: newTaskName,
//                 },
//             },
//         );

//         return { status: 200, error: '' }
//     } catch (error) {
//         return { status: 500, error: error.message }
//     } finally {
//         await client.close()
//     }
// }

// async function giveLateSubmit(taskName, userId) {
//     const client = new MongoClient("mongodb://127.0.0.1:27017");
//     try {
//         await client.connect();
//         const db = client.db('ChatBot');
//         const tasks = db.collection('tasks');
//         const practices = db.collection('practices');

//         await tasks.updateOne(
//             { taskName: taskName, 'submitList.userId': userId },
//             {
//                 $set: {
//                     'submitList.$.canSubmitLate': true,
//                 }
//             }
//         );

//         await practices.updateOne(
//             { chatId: taskName, userId: userId},
//             {
//                 $set: {
//                     lateSubmit: true,
//                 },
//             },
//         );
//         return { status: 200, error: '' }
//     } catch (error) {
//         return { status: 500, error: error.message }
//     } finally {
//         await client.close()
//     }
// }


// async function takeLateSubmit(taskName, userId) {
//     const client = new MongoClient("mongodb://127.0.0.1:27017");
//     try {
//         await client.connect();
//         const db = client.db('ChatBot');
//         const tasks = db.collection('tasks');

//         await tasks.updateOne(
//             { taskName: taskName, 'submitList.userId': userId },
//             {
//                 $set: {
//                     'submitList.$.canSubmitLate': false,
//                 }
//             }
//         );

//         await practices.updateOne(
//             { chatId: taskName, userId: userId},
//             {
//                 $set: {
//                     lateSubmit: false,
//                 },
//             },
//         );
//         return { status: 200, error: '' }
//     } catch (error) {
//         return { status: 500, error: error.message }
//     } finally {
//         await client.close()
//     }
// }

// module.exports = {
//     uploadFile,
//     makeTask,
//     getTasks,
//     getSubmissionStatus,
//     postFeedback,
//     changeTask,
//     giveLateSubmit,
//     takeLateSubmit
// };



// -------------------------------------------------------------------------------


const fs = require('fs');
const { MongoClient } = require('mongodb');
const { check, validationResult } = require('express-validator');
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

async function makeTask(taskName, startingDate, endingDate, durationHours, durationMinutes, year, users) {
    const errors = validationResult(users); // Assuming `users` is coming from the request body
    if (!errors.isEmpty()) {
        return { status: 400, errors: errors.array() };
    }

    try {

        const existingTask = await tasks.findOne({ taskName: taskName, year: year })
        if (existingTask) {
            return { status: 409, error: `This task already exists this year`}
        }
        const submitList = users
            .filter(user => user.year === year)
            .map(user => ({
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                didSubmit: false,
                canSubmitLate: false,
            }));

        await tasks.insertOne({
            taskName: taskName,
            startDate: startingDate, // Use Date objects for date fields
            endDate: endingDate,
            durationHours: parseInt(durationHours, 10),
            durationMinutes: parseInt(durationMinutes, 10),
            year: year,
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
        return { status: 200, tasks: taskList };
    } catch (error) {
        return { status: 500, tasks: error.message };
    }
}

async function getSubmissionStatus(taskName, year) {
    try {
        const task = await tasks.findOne({ taskName: taskName, year: parseInt(year, 10) });
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
            { chatId: chatId, userId: userId, active: false, year: year },
            {
                $set: {
                    feedback: feedback,
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
        await tasks.updateOne(
            { taskName: taskName, year: parseInt(year) },
            {
                $set: {
                    taskName: newTaskName,
                    endDate: newEndDate,
                },
            },
        );

        await practices.updateMany(
            { chatId: taskName, year: parseInt(year) },
            {
                $set: {
                    chatId: newTaskName,
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
        await tasks.deleteMany({ taskName: taskName, year: parseInt(year) });
        await practices.deleteMany({ chatId: taskName, year: parseInt(year) });
        return { status: 200, error: '' };
    } catch (error) {
        return { status: 500, error: error.message };
    }
}

async function giveLateSubmit(taskName, userId) {
    try {
        await tasks.updateOne(
            { taskName: taskName, 'submitList.userId': userId },
            {
                $set: {
                    'submitList.$.canSubmitLate': true,
                },
            }
        );

        await practices.updateOne(
            { chatId: taskName, userId: userId },
            {
                $set: {
                    lateSubmit: true,
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
            { taskName: taskName, 'submitList.userId': userId },
            {
                $set: {
                    'submitList.$.canSubmitLate': false,
                },
            }
        );

        await practices.updateOne(
            { chatId: taskName, userId: userId },
            {
                $set: {
                    lateSubmit: false,
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
    makeTask,
    getTasks,
    getSubmissionStatus,
    postFeedback,
    changeTask,
    removeTask,
    giveLateSubmit,
    takeLateSubmit,
    validateTaskInputs, // Export validation middleware for use in routes
};

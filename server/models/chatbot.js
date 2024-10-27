const { MongoClient } = require('mongodb');
const { check } = require('express-validator');
const { spawn } = require('child_process');
const os  = require('os');
const { randomInt } = require('crypto');

const client = new MongoClient("mongodb://127.0.0.1:27017");
const dbName = 'ChatBot';
const db = client.db(dbName);
const tasks = db.collection('tasks');
const practices = db.collection('practices');

let botProcesses = []

const validateTaskInputs = [
    check('taskName').isString().trim().escape(),
    check('startingDate').isISO8601(),
    check('endingDate').isISO8601(),
    check('durationHours').isInt({ min: 0 }),
    check('durationMinutes').isInt({ min: 0 }),
    check('year').isInt({ min: 0 }),
];

async function getPractice(chatId, userId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('practices');
        const practice = await practices.findOne({ chatId: chatId, userId: userId });
        return { status: 200, practice: practice };
    } catch (error) {
        return { status: 500, practice: error.message };
    } finally {
        await client.close();
    }
}

async function getPractices(userId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('practices');
        const res = await practices.find({ userId: userId }).toArray();
        return { status: 200, practices: res.reverse() };
    } catch (error) {
        return { status: 500, practices: error.message };
    } finally {
        await client.close();
    }
}


async function postPractice(userId, chatId, durationHours, durationMinutes, endDate, year) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const tasks = db.collection('tasks');
        const practices = db.collection('practices');
        
        const existingTask = await tasks.findOne({ taskName: chatId, year: year });
        if (!existingTask) {
            return { status: 404, practice: "Cannot create practice since task doesn't exist." };
        }
        
        const user = existingTask.submitList.find(user => user.userId === userId);
        
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        answers = existingTask.questions.answers
        answerIdx = randomInt(answers.length);
        for (let i in existingTask.questions.questions) {
            existingTask.questions.questions[i]['answer'] = answers[answerIdx]["answer"][i];
        }
        let questions = { "questions": existingTask.questions.questions }
        let botProcess = spawn('python3', ['-X', 'utf8', './bot.py', 0, JSON.stringify(questions)], {
            encoding: 'utf-8'
        })
        botProcess.id = chatId + userId
        botProcess.stdout.on('data', (data) => {
            messageData = data.toString().split('|');
            const result = addMessage(messageData[1], messageData[0], messageData[2], true);
        })
        botProcesses[botProcess.id] = botProcess

        await new Promise((resolve) => {
            setTimeout(resolve, 15000);
        });
        
        const practice = {
            userId: userId,
            chatId: chatId,
            messages: [],
            grade: user ? user.grade : null,
            feedback: user ? user.feedback : '',
            startDate: dateTime,
            submissionDate: null,
            endDate: endDate,
            durationHours: durationHours,
            durationMinutes: durationMinutes,
            year: year,
            active: true,
            lateSubmit: user ? user.canSubmitLate : false,
            botPic: existingTask.botPic
        };
        
        await practices.insertOne(practice);
        return { status: 200, practice: practice };
    } catch (error) {
        console.log(error.message)
        return { status: 500, practice: `${error.message}${os.EOL}Please inform an admin immediately` };
    } finally {
        await client.close();
    }
}

async function deletePractice(chatId, userId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('practices');
        const practice = await practices.findOne({ chatId: chatId, userId: userId });
        if (!practice) {
            return { status: 404, error: "Can not delete practice since the practice doesn't exist." };
        }
        await practices.deleteOne({ chatId: chatId, userId: userId });
        return { status: 200, error: "" };
    } catch (error) {
        return { status: 500, error: error.message };
    } finally {
        await client.close();
    }
}

async function submitPractice(userId, chatId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('practices');
        const tasks = db.collection('tasks');
        const task = await tasks.findOne({ taskName: chatId });
        if (!task) {
            return { status: 404, error: "Can not submit practice since the practice doesn't exist." };
        }
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        // if (dateTime > task.endDate) {
        //     return { status: 403, error: "Submission date passed." };
        // }
        botProcesses[chatId + userId].kill('SIGKILL');
        delete botProcesses[chatId + userId];
        await practices.updateOne(
            { chatId: chatId, userId: userId, active: true },
            {
                $set: {
                    active: false,
                    submissionDate: dateTime,
                },
            },
        );
        
        await tasks.updateOne(
            { taskName: chatId, 'submitList.userId': userId },
            {
                $set: {
                    'submitList.$.didSubmit': true,
                }
            }
        );
        return { status: 200, error: "" };
    } catch (error) {
        return { status: 500, error: error.message };
    } finally {
        await client.close();
    }
}

async function getMessages(chatId, userId) {
    try {
        const chat = (await getPractice(chatId, userId)).practice;
        return { status: 200, messages: chat.messages };
    } catch (error) {
        return { status: 500, messages: error.message };
    }
}

async function addMessage(userId, chatId, content, isBot) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('practices');
        await practices.updateOne(
            { chatId: chatId, userId: userId, active: true },
            {
                $push: {
                    messages: {
                        $each: [{ content: content, isBot: isBot }],
                        $position: 0
                    }
                },
            }
        );
        
        return { status: 200, error: "" };
    } catch (error) {
        console.log(error.message)
        return { status: 500, error: error.message };
    } finally {
        await client.close();
    }
}

async function updateGrade(userId, chatId, newGrade) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('practices');
        const tasks = db.collection('tasks');
        await practices.updateOne(
            { chatId: chatId, userId: userId, active: false },
            {
                $set: {
                    grade: newGrade,
                },
            },
        );
        
        await tasks.updateOne(
            { taskName: chatId, "submitList.userId": userId },
            {
                $set: {
                    "submitList.$.grade": newGrade
                }
            }
        )
        return { status: 200, error: "" };
    } catch (error) {
        return { status: 500, error: error.message };
    } finally {
        await client.close();
    }
}

module.exports = {
    getPractice,
    getPractices,
    deletePractice,
    postPractice,
    submitPractice,
    addMessage,
    getMessages,
    updateGrade,
    botProcesses,
};
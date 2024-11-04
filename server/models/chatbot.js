const { MongoClient } = require('mongodb');
const { spawn } = require('child_process');
const os = require('os');
const { randomInt } = require('crypto');
const mongoSanitize = require('mongo-sanitize');

const client = new MongoClient("mongodb://127.0.0.1:27017");
const dbName = 'ChatBot';
const db = client.db(dbName);
const tasks = db.collection('tasks');
const practices = db.collection('practices');

let botProcesses = []


async function getPractice(chatId, userId) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('practices');
        const practice = await practices.findOne({ chatId: { $eq: mongoSanitize(chatId) }, userId: { $eq: mongoSanitize(userId) } });
        if (!practice) {
            return { status: 404, practice: null }
        }
        practice.botPic = Buffer.from(practice.botPic, 'base64').toString('utf-8');
        practice.feedback = Buffer.from(practice.feedback, 'base64').toString('utf-8');
        if (practice.messages) {
            practice.messages.forEach((encMessage) => {
                encMessage.content = Buffer.from(encMessage.content, 'base64').toString('utf-8');
            })
        }
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
        const res = await practices.find({ userId: { $eq: mongoSanitize(userId) } }).toArray();

        res.forEach(practice => {
            if (typeof practice.botPic === 'string') {
                practice.botPic = Buffer.from(practice.botPic, 'base64').toString('utf-8');
            }
            if (typeof practice.feedback === 'string') {
                practice.feedback = Buffer.from(practice.feedback, 'base64').toString('utf-8');
            }
            if (Array.isArray(practice.messages)) {
                practice.messages = practice.messages.map((encMessage) => {
                    return typeof encMessage === 'string'
                        ? Buffer.from(encMessage, 'base64').toString('utf-8')
                        : encMessage;
                });
            }
        });

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

        const existingTask = await tasks.findOne({
            taskName:
                { $eq: mongoSanitize(chatId) }, year: { $eq: parseInt(year) }
        });
        if (!existingTask) {
            return { status: 404, practice: "Cannot create practice since task doesn't exist." };
        }

        const user = existingTask.submitList.find(user => user.userId === mongoSanitize(userId))

        const time = Date.now()
        if (!(time < Math.max(user.endDate, existingTask.endDate))) {
            return { status: 400, practice: "Submission date passed!" };
        }
        const decodedQuestions = JSON.parse(Buffer.from(existingTask.questions, 'base64').toString('utf-8'));
        answers = decodedQuestions.answers
        answerIdx = randomInt(answers.length);
        for (let i in decodedQuestions.questions) {
            decodedQuestions.questions[i]['answer'] = answers[answerIdx]["answer"][i];
        }
        let questions = { "questions": decodedQuestions.questions }
        let botProcess = spawn('python3', ['-X', 'utf8', './bot.py', JSON.stringify(questions)], {
            encoding: 'utf-8'
        })
        botProcess.stdout.on('data', (data) => {
            messageData = data.toString().split('|');
            addMessage(messageData[1], messageData[0], messageData[2], true);
        })
        botProcesses[chatId + userId] = botProcess
        await new Promise((resolve) => {
            setTimeout(resolve, 15000);
        });

        const practice = {
            userId: mongoSanitize(userId),
            chatId: mongoSanitize(chatId),
            messages: [],
            grade: user ? user.grade : null,
            feedback: user ? user.feedback : '',
            startDate: Date.now(),
            submissionDate: null,
            endDate: Math.max(parseInt(endDate), user.endDate),
            durationHours: parseInt(durationHours),
            durationMinutes: parseInt(durationMinutes),
            year: parseInt(year),
            active: true,
            lateSubmit: user ? user.canSubmitLate : false,
            botPic: existingTask.botPic
        };
        await practices.insertOne(practice);
        practice.botPic = Buffer.from(practice.botPic, 'base64').toString('utf-8');
        practice.feedback = Buffer.from(practice.feedback, 'base64').toString('utf-8');
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
        const practice = await practices.findOne({ chatId: { $eq: mongoSanitize(chatId) }, userId: { $eq: mongoSanitize(userId) } });
        if (!practice) {
            return { status: 404, error: "Can not delete practice since the practice doesn't exist." };
        }
        await practices.deleteOne({ chatId: { $eq: mongoSanitize(chatId) }, userId: { $eq: mongoSanitize(userId) } });
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
        chatId = mongoSanitize(chatId)
        userId = mongoSanitize(userId)
        const task = await tasks.findOne({ taskName: { $eq: chatId } });
        if (!task) {
            return { status: 404, error: "Can not submit practice since the practice doesn't exist." };
        }
        var time = Date.now();
        const submitData = task.submitList.find(user => user.userId === userId)

        if (!(time < Math.max(submitData.endDate, task.endDate))) {
            return { status: 400, practice: "Submission date passed." };
        }
        if (botProcesses[chatId + userId]) {
            botProcesses[chatId + userId].kill('SIGKILL');
            delete botProcesses[chatId + userId];
        }
        await practices.updateOne(
            { chatId: { $eq: chatId }, userId: { $eq: userId }, active: { $eq: true } },
            {
                $set: {
                    active: false,
                    submissionDate: time,
                },
            },
        );

        await tasks.updateOne(
            { taskName: { $eq: mongoSanitize(chatId) }, 'submitList.userId': { $eq: mongoSanitize(userId) } },
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
        chat.messages.forEach((encMessage) => {
            encMessage.content = Buffer.from(encMessage.content, 'base64').toString('utf-8');
        })
        return { status: 200, messages: chat.messages };
    } catch (error) {
        console.log(error.message)
        return { status: 500, messages: error.message };
    }
}

async function addMessage(userId, chatId, content, isBot) {
    const HOURS_TO_MS = 3600000;
    const MIN_TO_MS = 60000
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const practices = db.collection('practices');
        const practice = await practices.findOne({
            chatId: { $eq: mongoSanitize(chatId) },
            userId: { $eq: mongoSanitize(userId) }, active: { $eq: true }
        });
        if (!practice) {
            return { status: 404, error: "Couldn't find chat" };
        }
        var time = Date.now();
        if ((practice.durationHours || practice.durationMinutes) && !isBot) {
            if (time - practice.startDate > practice.durationHours * HOURS_TO_MS + practice.durationMinutes * MIN_TO_MS) {
                return { status: 400, error: "Submission timer ran out." }
            }
        }

        await practices.updateOne(
            { chatId: { $eq: mongoSanitize(chatId) }, userId: { $eq: mongoSanitize(userId) }, active: { $eq: true } },
            {
                $push: {
                    messages: {
                        $each: [{ content: Buffer.from(content).toString('base64'), isBot: isBot }],
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
            { chatId: { $eq: mongoSanitize(chatId) }, userId: { $eq: mongoSanitize(userId) }, active: { $eq: false } },
            {
                $set: {
                    grade: parseInt(newGrade),
                },
            },
        );

        await tasks.updateOne(
            { taskName: { $eq: mongoSanitize(chatId) }, "submitList.userId": { $eq: mongoSanitize(userId) } },
            {
                $set: {
                    "submitList.$.grade": parseInt(newGrade),
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

async function getSubmissionData(chatId, userId, year) {
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    try {
        await client.connect();
        const db = client.db('ChatBot');
        const tasks = db.collection('tasks');
        const task = await tasks.findOne({ taskName: { $eq: mongoSanitize(chatId) }, year: { $eq: parseInt(year) } });
        if (!task) {
            return { status: 404, submitData: 'Task does not exist' }
        }
        return { status: 200, submitData: task.submitList.find(user => user.userId === userId) }
    } catch (error) {
        return { status: 500, submitData: error.message };
    } finally {
        await client.close()
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
    getSubmissionData,
    botProcesses,
};